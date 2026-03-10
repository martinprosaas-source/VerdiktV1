import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const FROM = 'Verdikt <contact@verdikt.dev>';

// ─── Email Templates ──────────────────────────────────────────────────────────

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

function welcomeHtml(p: {
    firstName: string;
    teamName: string;
    appUrl: string;
}) {
    return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Bienvenue sur Verdikt</title>
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
            Bienvenue sur Verdikt, ${p.firstName} 👋
          </h1>
          <p style="margin:0 0 28px;font-size:15px;color:#71717a;line-height:1.7;">
            Votre espace de travail <strong style="color:#18181b;">${p.teamName}</strong> est prêt. Prenez de meilleures décisions en équipe, plus rapidement.
          </p>

          <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;margin-bottom:28px;">
            <tr><td style="padding:20px 24px;">
              <p style="margin:0 0 12px;font-size:13px;font-weight:700;color:#166534;text-transform:uppercase;letter-spacing:0.4px;">Pour commencer</p>
              <table cellpadding="0" cellspacing="0" role="presentation">
                <tr><td style="padding:5px 0;font-size:14px;color:#166534;">✓&nbsp;&nbsp;Invitez vos coéquipiers depuis les Paramètres</td></tr>
                <tr><td style="padding:5px 0;font-size:14px;color:#166534;">✓&nbsp;&nbsp;Créez votre première décision d'équipe</td></tr>
                <tr><td style="padding:5px 0;font-size:14px;color:#166534;">✓&nbsp;&nbsp;Connectez Slack ou Google Calendar</td></tr>
              </table>
            </td></tr>
          </table>

          <table cellpadding="0" cellspacing="0" role="presentation">
            <tr><td style="border-radius:8px;background:#10b981;">
              <a href="${p.appUrl}" style="display:inline-block;padding:14px 28px;color:#fff;text-decoration:none;font-size:15px;font-weight:600;letter-spacing:-0.2px;">Accéder à mon espace →</a>
            </td></tr>
          </table>
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

// ─── Handler ──────────────────────────────────────────────────────────────────

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
        const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
        const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
        const FRONTEND_URL = Deno.env.get('FRONTEND_URL') || 'https://verdikt.dev';

        if (!RESEND_API_KEY || !SUPABASE_URL) {
            return json({ error: 'missing_config' }, 500);
        }

        // Require authenticated user (welcome email is self-triggered)
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) return json({ error: 'unauthorized' }, 401);

        const callerClient = createClient(SUPABASE_URL, Deno.env.get('SUPABASE_ANON_KEY') || '', {
            global: { headers: { Authorization: authHeader } },
        });
        const { data: { user }, error: authError } = await callerClient.auth.getUser();
        if (authError || !user) return json({ error: 'unauthorized' }, 401);

        const body = await req.json();
        const { type, data } = body;

        let subject = '';
        let html = '';

        if (type === 'welcome') {
            if (!data?.firstName || !data?.teamName) {
                return json({ error: 'missing_params' }, 400);
            }
            subject = `Bienvenue sur Verdikt, ${data.firstName} 👋`;
            html = welcomeHtml({
                firstName: data.firstName,
                teamName: data.teamName,
                appUrl: `${FRONTEND_URL}/app`,
            });
        } else {
            return json({ error: 'unknown_type' }, 400);
        }

        const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${RESEND_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from: FROM,
                to: [user.email],
                subject,
                html,
            }),
        });

        const resData = await res.json();
        if (!res.ok) return json({ error: 'resend_error', details: resData }, 500);

        return json({ success: true, id: resData.id });
    } catch (err: any) {
        return new Response(
            JSON.stringify({ error: 'internal_error', message: err.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
    }
});
