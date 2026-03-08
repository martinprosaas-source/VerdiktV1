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
      return Response.redirect(`${FRONTEND_URL}/app/settings?notion=error&reason=${error}`, 302);
    }

    if (!code || !stateParam) {
      return Response.redirect(`${FRONTEND_URL}/app/settings?notion=error&reason=missing_params`, 302);
    }

    let state: { team_id: string; user_id: string };
    try {
      state = JSON.parse(atob(stateParam));
    } catch {
      return Response.redirect(`${FRONTEND_URL}/app/settings?notion=error&reason=invalid_state`, 302);
    }

    const NOTION_CLIENT_ID = Deno.env.get('NOTION_CLIENT_ID')!;
    const NOTION_CLIENT_SECRET = Deno.env.get('NOTION_CLIENT_SECRET')!;
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const redirectUri = `${SUPABASE_URL}/functions/v1/notion-oauth-callback`;

    // Exchange code for access token
    const credentials = btoa(`${NOTION_CLIENT_ID}:${NOTION_CLIENT_SECRET}`);
    const tokenResponse = await fetch('https://api.notion.com/v1/oauth/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      console.error('Notion OAuth error:', tokenData);
      return Response.redirect(
        `${FRONTEND_URL}/app/settings?notion=error&reason=${tokenData.error}`,
        302,
      );
    }

    // Store integration in database
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const integrationData = {
      team_id: state.team_id,
      provider: 'notion',
      access_token: tokenData.access_token,
      bot_user_id: tokenData.bot_id || null,
      workspace_name: tokenData.workspace_name || null,
      connected_by: state.user_id,
      settings: {
        workspace_id: tokenData.workspace_id,
        workspace_name: tokenData.workspace_name,
        workspace_icon: tokenData.workspace_icon,
        owner: tokenData.owner,
        duplicated_template_id: tokenData.duplicated_template_id,
        auto_export: true,
        database_id: null,
      },
    };

    const { error: dbError } = await supabase
      .from('team_integrations')
      .upsert(integrationData, { onConflict: 'team_id,provider' });

    if (dbError) {
      console.error('DB error:', dbError);
      return Response.redirect(`${FRONTEND_URL}/app/settings?notion=error&reason=db_error`, 302);
    }

    return Response.redirect(`${FRONTEND_URL}/app/settings?notion=connected`, 302);
  } catch (error) {
    console.error('Notion callback error:', error);
    const FRONTEND_URL = Deno.env.get('FRONTEND_URL') || 'http://localhost:5173';
    return Response.redirect(`${FRONTEND_URL}/app/settings?notion=error&reason=server_error`, 302);
  }
});
