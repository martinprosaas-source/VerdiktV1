import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const FROM = 'Verdikt <contact@verdikt.dev>';

function invitationHtml(p: {
    inviterName: string;
    teamName: string;
    inviteUrl: string;
    role: string;
}) {
    const roleLabel = p.role === 'admin' ? 'Admin' : 'Membre';
    return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Invitation Verdikt</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#f4f4f5;padding:48px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:560px;" cellpadding="0" cellspacing="0" role="presentation">

        <!-- HEADER -->
        <tr><td style="background:#18181b;border-radius:12px 12px 0 0;padding:28px 40px;">
          <table cellpadding="0" cellspacing="0" role="presentation"><tr>
            <td style="width:34px;height:34px;background:#10b981;border-radius:8px;text-align:center;vertical-align:middle;font-size:18px;font-weight:700;color:#fff;line-height:34px;">V</td>
            <td style="padding-left:10px;color:#fff;font-size:18px;font-weight:600;letter-spacing:-0.4px;">Verdikt</td>
          </tr></table>
        </td></tr>

        <!-- BODY -->
        <tr><td style="background:#fff;padding:40px;">
          <h1 style="margin:0 0 10px;font-size:22px;font-weight:700;color:#18181b;letter-spacing:-0.5px;line-height:1.3;">
            Vous êtes invité à rejoindre <span style="color:#10b981;">${p.teamName}</span>
          </h1>
          <p style="margin:0 0 28px;font-size:15px;color:#71717a;line-height:1.7;">
            <strong style="color:#18181b;">${p.inviterName}</strong> vous invite à rejoindre son espace de travail sur Verdikt en tant que <strong style="color:#18181b;">${roleLabel}</strong>.
          </p>

          <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;margin-bottom:28px;">
            <tr><td style="padding:18px 20px;">
              <p style="margin:0 0 4px;font-size:11px;color:#9ca3af;text-transform:uppercase;letter-spacing:0.6px;font-weight:600;">Équipe</p>
              <p style="margin:0;font-size:16px;font-weight:700;color:#18181b;">${p.teamName}</p>
            </td></tr>
          </table>

          <table cellpadding="0" cellspacing="0" role="presentation">
            <tr><td style="border-radius:8px;background:#10b981;">
              <a href="${p.inviteUrl}" style="display:inline-block;padding:14px 28px;color:#fff;text-decoration:none;font-size:15px;font-weight:600;letter-spacing:-0.2px;">Rejoindre l'équipe →</a>
            </td></tr>
          </table>

          <p style="margin:28px 0 0;font-size:13px;color:#9ca3af;line-height:1.6;">
            Ce lien est valable <strong>24 heures</strong>. Si vous n'attendiez pas cette invitation, ignorez simplement cet email.
          </p>
        </td></tr>

        <!-- FOOTER -->
        <tr><td style="background:#f9fafb;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px;padding:18px 40px;">
          <table width="100%" cellpadding="0" cellspacing="0" role="presentation"><tr>
            <td style="font-size:12px;color:#9ca3af;">© 2026 Verdikt · Tous droits réservés</td>
            <td align="right"><a href="https://verdikt.dev" style="font-size:12px;color:#10b981;text-decoration:none;">verdikt.dev</a></td>
          </tr></table>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    const json = (body: object, status = 200) =>
        new Response(JSON.stringify(body), {
            status,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

    try {
        const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
        const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
        const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
        const FRONTEND_URL = Deno.env.get('FRONTEND_URL') || 'https://verdikt.dev';

        if (!SUPABASE_URL || !SERVICE_ROLE_KEY || !RESEND_API_KEY) {
            return json({ error: 'missing_config', message: 'Configuration serveur manquante.' }, 500);
        }

        // Authenticate the caller
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) return json({ error: 'unauthorized', message: 'Non authentifié.' }, 401);

        const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
        const callerClient = createClient(SUPABASE_URL, Deno.env.get('SUPABASE_ANON_KEY') || '', {
            global: { headers: { Authorization: authHeader } },
        });

        const { data: { user: caller }, error: callerError } = await callerClient.auth.getUser();
        if (callerError || !caller) return json({ error: 'unauthorized', message: 'Token invalide.' }, 401);

        // Get caller's profile + team name
        const { data: callerProfile } = await supabaseAdmin
            .from('users')
            .select('role, team_id, first_name, last_name')
            .eq('id', caller.id)
            .single();

        if (!callerProfile?.team_id) {
            return json({ error: 'no_team', message: "Vous n'appartenez pas à une équipe." }, 403);
        }
        if (!['owner', 'admin'].includes(callerProfile.role)) {
            return json({ error: 'forbidden', message: 'Seuls les admins peuvent inviter des membres.' }, 403);
        }

        const { data: team } = await supabaseAdmin
            .from('teams')
            .select('name')
            .eq('id', callerProfile.team_id)
            .single();

        const inviterName = `${callerProfile.first_name || ''} ${callerProfile.last_name || ''}`.trim() || 'Un membre de l\'équipe';
        const teamName = team?.name || 'votre équipe';

        const { emails, role } = await req.json();
        if (!emails || !Array.isArray(emails) || emails.length === 0) {
            return json({ error: 'invalid_params', message: 'Emails requis.' }, 400);
        }

        const validRole = ['admin', 'member'].includes(role) ? role : 'member';
        const results: { email: string; success: boolean; error?: string }[] = [];

        for (const email of emails) {
            try {
                // Generate magic invite link (creates user, does NOT send Supabase default email)
                const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
                    type: 'invite',
                    email,
                    options: {
                        redirectTo: `${FRONTEND_URL}/app`,
                        data: {
                            invited_team_id: callerProfile.team_id,
                            invited_role: validRole,
                            invited_by: caller.id,
                        },
                    },
                });

                if (linkError || !linkData?.properties?.action_link) {
                    results.push({ email, success: false, error: linkError?.message || 'Impossible de générer le lien.' });
                    continue;
                }

                const inviteUrl = linkData.properties.action_link;

                // Send branded email via Resend
                const emailRes = await fetch('https://api.resend.com/emails', {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${RESEND_API_KEY}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        from: FROM,
                        to: [email],
                        subject: `${inviterName} vous invite à rejoindre ${teamName} sur Verdikt`,
                        html: invitationHtml({ inviterName, teamName, inviteUrl, role: validRole }),
                    }),
                });

                if (!emailRes.ok) {
                    const errData = await emailRes.json();
                    results.push({ email, success: false, error: errData?.message || 'Erreur Resend.' });
                } else {
                    results.push({ email, success: true });
                }
            } catch (err: any) {
                results.push({ email, success: false, error: err.message });
            }
        }

        const successCount = results.filter(r => r.success).length;
        return json({ success: successCount > 0, sent: successCount, total: emails.length, results });
    } catch (err: any) {
        return new Response(
            JSON.stringify({ error: 'internal_error', message: err.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
    }
});
