import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get('code');
    const stateParam = url.searchParams.get('state');
    const error = url.searchParams.get('error');

    const FRONTEND_URL = Deno.env.get('FRONTEND_URL') || 'http://localhost:5173';

    if (error) {
      return Response.redirect(`${FRONTEND_URL}/app/settings?slack=error&reason=${error}`, 302);
    }

    if (!code || !stateParam) {
      return Response.redirect(`${FRONTEND_URL}/app/settings?slack=error&reason=missing_params`, 302);
    }

    // Decode state
    let state: { team_id: string; user_id: string };
    try {
      state = JSON.parse(atob(stateParam));
    } catch {
      return Response.redirect(`${FRONTEND_URL}/app/settings?slack=error&reason=invalid_state`, 302);
    }

    const SLACK_CLIENT_ID = Deno.env.get('SLACK_CLIENT_ID')!;
    const SLACK_CLIENT_SECRET = Deno.env.get('SLACK_CLIENT_SECRET')!;
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const redirectUri = `${SUPABASE_URL}/functions/v1/slack-oauth-callback`;

    // Exchange code for token
    const tokenResponse = await fetch('https://slack.com/api/oauth.v2.access', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: SLACK_CLIENT_ID,
        client_secret: SLACK_CLIENT_SECRET,
        code,
        redirect_uri: redirectUri,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenData.ok) {
      console.error('Slack OAuth error:', tokenData);
      return Response.redirect(
        `${FRONTEND_URL}/app/settings?slack=error&reason=${tokenData.error}`,
        302,
      );
    }

    // Store integration in database using service role (bypasses RLS)
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const integrationData = {
      team_id: state.team_id,
      provider: 'slack',
      access_token: tokenData.access_token,
      bot_user_id: tokenData.bot_user_id,
      channel_id: tokenData.incoming_webhook?.channel_id || null,
      channel_name: tokenData.incoming_webhook?.channel || null,
      workspace_name: tokenData.team?.name || null,
      webhook_url: tokenData.incoming_webhook?.url || null,
      connected_by: state.user_id,
      settings: {
        notify_new_decision: true,
        notify_new_vote: true,
        notify_vote_reminder: true,
        notify_decision_complete: true,
        team_id: tokenData.team?.id,
        team_name: tokenData.team?.name,
        scope: tokenData.scope,
      },
    };

    const { error: dbError } = await supabase
      .from('team_integrations')
      .upsert(integrationData, { onConflict: 'team_id,provider' });

    if (dbError) {
      console.error('DB error:', dbError);
      return Response.redirect(`${FRONTEND_URL}/app/settings?slack=error&reason=db_error`, 302);
    }

    return Response.redirect(`${FRONTEND_URL}/app/settings?slack=connected`, 302);
  } catch (error) {
    console.error('Callback error:', error);
    const FRONTEND_URL = Deno.env.get('FRONTEND_URL') || 'http://localhost:5173';
    return Response.redirect(`${FRONTEND_URL}/app/settings?slack=error&reason=server_error`, 302);
  }
});
