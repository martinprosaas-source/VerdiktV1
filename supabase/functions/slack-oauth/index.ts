import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const SLACK_CLIENT_ID = Deno.env.get('SLACK_CLIENT_ID');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');

    if (!SLACK_CLIENT_ID) {
      throw new Error('SLACK_CLIENT_ID not configured');
    }

    const { team_id, user_id } = await req.json();

    if (!team_id || !user_id) {
      throw new Error('team_id and user_id are required');
    }

    // Encode state as base64 JSON (team_id + user_id for the callback)
    const state = btoa(JSON.stringify({ team_id, user_id, ts: Date.now() }));

    const redirectUri = `${SUPABASE_URL}/functions/v1/slack-oauth-callback`;

    const scopes = [
      'chat:write',
      'chat:write.public',
      'channels:read',
      'commands',
      'incoming-webhook',
    ].join(',');

    const slackAuthUrl = `https://slack.com/oauth/v2/authorize?client_id=${SLACK_CLIENT_ID}&scope=${scopes}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`;

    return new Response(
      JSON.stringify({ url: slackAuthUrl }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    );
  }
});
