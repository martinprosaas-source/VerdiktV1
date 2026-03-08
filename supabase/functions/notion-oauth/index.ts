import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const NOTION_CLIENT_ID = Deno.env.get('NOTION_CLIENT_ID');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');

    if (!NOTION_CLIENT_ID) {
      throw new Error('NOTION_CLIENT_ID not configured');
    }

    const { team_id, user_id } = await req.json();

    if (!team_id || !user_id) {
      throw new Error('team_id and user_id are required');
    }

    const state = btoa(JSON.stringify({ team_id, user_id, ts: Date.now() }));
    const redirectUri = `${SUPABASE_URL}/functions/v1/notion-oauth-callback`;

    const notionAuthUrl = `https://api.notion.com/v1/oauth/authorize?client_id=${NOTION_CLIENT_ID}&response_type=code&owner=user&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`;

    return new Response(
      JSON.stringify({ url: notionAuthUrl }),
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
