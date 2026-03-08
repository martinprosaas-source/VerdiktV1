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
      return Response.redirect(`${FRONTEND_URL}/app/settings?gcal=error&reason=${error}`, 302);
    }

    if (!code || !stateParam) {
      return Response.redirect(`${FRONTEND_URL}/app/settings?gcal=error&reason=missing_params`, 302);
    }

    let state: { user_id: string };
    try {
      state = JSON.parse(atob(stateParam));
    } catch {
      return Response.redirect(`${FRONTEND_URL}/app/settings?gcal=error&reason=invalid_state`, 302);
    }

    const GOOGLE_CLIENT_ID = Deno.env.get('GOOGLE_CLIENT_ID')!;
    const GOOGLE_CLIENT_SECRET = Deno.env.get('GOOGLE_CLIENT_SECRET')!;
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const redirectUri = `${SUPABASE_URL}/functions/v1/google-calendar-oauth-callback`;

    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      console.error('Google OAuth error:', tokenData);
      return Response.redirect(
        `${FRONTEND_URL}/app/settings?gcal=error&reason=${tokenData.error}`,
        302,
      );
    }

    // Store tokens in database using service role
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { error: dbError } = await supabase
      .from('user_google_tokens')
      .upsert({
        user_id: state.user_id,
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token || null,
        token_expires_at: new Date(Date.now() + (tokenData.expires_in || 3600) * 1000).toISOString(),
        calendar_enabled: true,
      }, { onConflict: 'user_id' });

    if (dbError) {
      console.error('DB error:', dbError);
      return Response.redirect(`${FRONTEND_URL}/app/settings?gcal=error&reason=db_error`, 302);
    }

    return Response.redirect(`${FRONTEND_URL}/app/settings?gcal=connected`, 302);
  } catch (error) {
    console.error('Google Calendar callback error:', error);
    const FRONTEND_URL = Deno.env.get('FRONTEND_URL') || 'http://localhost:5173';
    return Response.redirect(`${FRONTEND_URL}/app/settings?gcal=error&reason=server_error`, 302);
  }
});
