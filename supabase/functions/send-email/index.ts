import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const FROM = 'Verdikt <contact@verdikt.dev>';

// ─── Shared head meta (light-mode enforcement + Gmail dark-mode override) ─────

function emailHead(title: string) {
    return `<meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <meta name="color-scheme" content="light" />
  <meta name="supported-color-schemes" content="light" />
  <style>
    :root { color-scheme: light; }
    [data-ogsc] .email-header { background-color: #18181b !important; }
    [data-ogsc] .email-body   { background-color: #ffffff !important; color: #18181b !important; }
    [data-ogsc] .email-footer { background-color: #f9fafb !important; }
    [data-ogsc] .text-main    { color: #18181b !important; }
    [data-ogsc] .text-muted   { color: #71717a !important; }
    [data-ogsc] .text-light   { color: #9ca3af !important; }
    [data-ogsc] .highlight-box { background-color: #f9fafb !important; }
    [data-ogsc] .green-box    { background-color: #f0fdf4 !important; }
    [data-ogsc] .btn-cta td  { background-color: #10b981 !important; }
    [data-ogsc] .btn-cta a   { color: #ffffff !important; }
  </style>
  <title>${title}</title>`;
}

// ─── Templates ────────────────────────────────────────────────────────────────

function welcomeHtml(p: { firstName: string; teamName: string; appUrl: string }) {
    return `<!DOCTYPE html>
<html lang="fr">
<head>${emailHead('Bienvenue sur Verdikt')}</head>
<body style="margin:0;padding:0;background:transparent;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" bgcolor="transparent" style="background:transparent;padding:48px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:560px;" cellpadding="0" cellspacing="0" role="presentation">

        <tr><td class="email-header" bgcolor="#18181b" style="background:#18181b;border-radius:12px 12px 0 0;padding:28px 40px;">
          <img src="https://verdikt.dev/Logo%20FN%20verdikt.png" alt="Verdikt" height="32" style="display:block;height:32px;width:auto;" />
        </td></tr>

        <tr><td class="email-body" bgcolor="#ffffff" style="background:#ffffff;padding:40px;border-left:1px solid #e5e7eb;border-right:1px solid #e5e7eb;">
          <h1 class="text-main" style="margin:0 0 10px;font-size:22px;font-weight:700;color:#18181b;letter-spacing:-0.5px;line-height:1.3;">
            Bienvenue sur Verdikt, ${p.firstName} 👋
          </h1>
          <p class="text-muted" style="margin:0 0 28px;font-size:15px;color:#71717a;line-height:1.7;">
            Votre espace de travail <strong class="text-main" style="color:#18181b;">${p.teamName}</strong> est prêt. Prenez de meilleures décisions en équipe, plus rapidement.
          </p>

          <table width="100%" cellpadding="0" cellspacing="0" role="presentation" class="green-box" style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;margin-bottom:28px;">
            <tr><td style="padding:20px 24px;">
              <p style="margin:0 0 12px;font-size:13px;font-weight:700;color:#166534;text-transform:uppercase;letter-spacing:0.4px;">Pour commencer</p>
              <table cellpadding="0" cellspacing="0" role="presentation">
                <tr><td style="padding:5px 0;font-size:14px;color:#166534;">✓&nbsp;&nbsp;Invitez vos coéquipiers depuis les Paramètres</td></tr>
                <tr><td style="padding:5px 0;font-size:14px;color:#166534;">✓&nbsp;&nbsp;Créez votre première décision d'équipe</td></tr>
                <tr><td style="padding:5px 0;font-size:14px;color:#166534;">✓&nbsp;&nbsp;Connectez Slack ou Google Calendar</td></tr>
              </table>
            </td></tr>
          </table>

          <table cellpadding="0" cellspacing="0" role="presentation" class="btn-cta">
            <tr><td bgcolor="#10b981" style="border-radius:8px;background:#10b981;">
              <a href="${p.appUrl}" style="display:inline-block;padding:14px 28px;color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;letter-spacing:-0.2px;">Accéder à mon espace →</a>
            </td></tr>
          </table>
        </td></tr>

        <tr><td class="email-footer" bgcolor="#f9fafb" style="background:#f9fafb;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px;padding:18px 40px;">
          <table width="100%" cellpadding="0" cellspacing="0" role="presentation"><tr>
            <td class="text-light" style="font-size:12px;color:#9ca3af;">© 2026 Verdikt · Tous droits réservés</td>
            <td align="right"><a href="https://verdikt.dev" style="font-size:12px;color:#10b981;text-decoration:none;">verdikt.dev</a></td>
          </tr></table>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function betaConfirmationHtml(p: { firstName: string; plan: string }) {
    const planLabel = p.plan === 'Pro' ? 'Pro — 790 €/an' : 'Business — 1 990 €/an';
    return `<!DOCTYPE html>
<html lang="fr">
<head>${emailHead('Demande Bêta Verdikt')}</head>
<body style="margin:0;padding:0;background:transparent;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" bgcolor="transparent" style="background:transparent;padding:48px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:560px;" cellpadding="0" cellspacing="0" role="presentation">

        <tr><td class="email-header" bgcolor="#18181b" style="background:#18181b;border-radius:12px 12px 0 0;padding:28px 40px;">
          <img src="https://verdikt.dev/Logo%20FN%20verdikt.png" alt="Verdikt" height="32" style="display:block;height:32px;width:auto;" />
        </td></tr>

        <tr><td class="email-body" bgcolor="#ffffff" style="background:#ffffff;padding:40px;border-left:1px solid #e5e7eb;border-right:1px solid #e5e7eb;">
          <h1 class="text-main" style="margin:0 0 10px;font-size:22px;font-weight:700;color:#18181b;letter-spacing:-0.5px;line-height:1.3;">
            Demande reçue, ${p.firstName} 🎉
          </h1>
          <p class="text-muted" style="margin:0 0 28px;font-size:15px;color:#71717a;line-height:1.7;">
            Votre demande d'accès bêta a bien été enregistrée. Nous examinerons votre dossier et reviendrons vers vous sous <strong class="text-main" style="color:#18181b;">24 heures</strong>.
          </p>

          <table width="100%" cellpadding="0" cellspacing="0" role="presentation" class="highlight-box" style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;margin-bottom:28px;">
            <tr><td style="padding:18px 20px;">
              <p class="text-light" style="margin:0 0 4px;font-size:11px;color:#9ca3af;text-transform:uppercase;letter-spacing:0.6px;font-weight:600;">Plan sélectionné</p>
              <p class="text-main" style="margin:0;font-size:16px;font-weight:700;color:#18181b;">${planLabel}</p>
              <p style="margin:4px 0 0;font-size:13px;color:#10b981;font-weight:500;">Prix Founding Member garanti à vie</p>
            </td></tr>
          </table>

          <p class="text-muted" style="margin:0;font-size:14px;color:#71717a;line-height:1.7;">
            En attendant, n'hésitez pas à nous écrire à <a href="mailto:contact@verdikt.dev" style="color:#10b981;text-decoration:none;">contact@verdikt.dev</a> si vous avez des questions.
          </p>
        </td></tr>

        <tr><td class="email-footer" bgcolor="#f9fafb" style="background:#f9fafb;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px;padding:18px 40px;">
          <table width="100%" cellpadding="0" cellspacing="0" role="presentation"><tr>
            <td class="text-light" style="font-size:12px;color:#9ca3af;">© 2026 Verdikt · Tous droits réservés</td>
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
        const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
        const FRONTEND_URL = Deno.env.get('FRONTEND_URL') || 'https://verdikt.dev';

        if (!RESEND_API_KEY || !SUPABASE_URL || !SERVICE_ROLE_KEY) {
            return json({ error: 'missing_config' }, 500);
        }

        const body = await req.json();
        const { type, data } = body;

        // ── beta_confirmation: public endpoint (no auth required) ─────────────
        if (type === 'beta_confirmation') {
            const { email, firstName, plan } = data || {};
            if (!email || !firstName) return json({ error: 'missing_params' }, 400);

            // Security: verify the email actually exists in beta_registrations
            const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
            const { data: reg } = await supabaseAdmin
                .from('beta_registrations')
                .select('id')
                .eq('email', email.trim().toLowerCase())
                .single();

            if (!reg) return json({ error: 'not_registered' }, 404);

            const res = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${RESEND_API_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    from: FROM,
                    to: [email],
                    subject: `Demande reçue, ${firstName} 🎉`,
                    html: betaConfirmationHtml({ firstName, plan: plan || 'Pro' }),
                }),
            });

            const resData = await res.json();
            if (!res.ok) return json({ error: 'resend_error', details: resData }, 500);
            return json({ success: true, id: resData.id });
        }

        // ── Authenticated types (welcome, …) ──────────────────────────────────
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) return json({ error: 'unauthorized' }, 401);

        const callerClient = createClient(SUPABASE_URL, Deno.env.get('SUPABASE_ANON_KEY') || '', {
            global: { headers: { Authorization: authHeader } },
        });
        const { data: { user }, error: authError } = await callerClient.auth.getUser();
        if (authError || !user) return json({ error: 'unauthorized' }, 401);

        if (type === 'welcome') {
            const { firstName, teamName } = data || {};
            if (!firstName || !teamName) return json({ error: 'missing_params' }, 400);

            const res = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${RESEND_API_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    from: FROM,
                    to: [user.email],
                    subject: `Bienvenue sur Verdikt, ${firstName} 👋`,
                    html: welcomeHtml({ firstName, teamName, appUrl: `${FRONTEND_URL}/app` }),
                }),
            });

            const resData = await res.json();
            if (!res.ok) return json({ error: 'resend_error', details: resData }, 500);
            return json({ success: true, id: resData.id });
        }

        return json({ error: 'unknown_type' }, 400);
    } catch (err: any) {
        return new Response(
            JSON.stringify({ error: 'internal_error', message: err.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
    }
});
