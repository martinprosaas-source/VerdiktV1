import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { createHmac, timingSafeEqual } from 'https://deno.land/std@0.177.0/node/crypto.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const SLACK_SIGNING_SECRET = Deno.env.get('SLACK_SIGNING_SECRET')!;

function verifySlackSignature(body: string, timestamp: string, signature: string): boolean {
  if (!SLACK_SIGNING_SECRET) return false;

  const fiveMinAgo = Math.floor(Date.now() / 1000) - 60 * 5;
  if (parseInt(timestamp) < fiveMinAgo) return false;

  const sigBasestring = `v0:${timestamp}:${body}`;
  const mySignature = 'v0=' + createHmac('sha256', SLACK_SIGNING_SECRET)
    .update(sigBasestring)
    .digest('hex');

  try {
    return timingSafeEqual(
      new TextEncoder().encode(mySignature),
      new TextEncoder().encode(signature),
    );
  } catch {
    return false;
  }
}

serve(async (req) => {
  try {
    const body = await req.text();
    const timestamp = req.headers.get('x-slack-request-timestamp') || '';
    const signature = req.headers.get('x-slack-signature') || '';

    if (SLACK_SIGNING_SECRET && !verifySlackSignature(body, timestamp, signature)) {
      return new Response('Invalid signature', { status: 401 });
    }

    const params = new URLSearchParams(body);
    const payloadStr = params.get('payload');

    if (!payloadStr) {
      return new Response('No payload', { status: 400 });
    }

    const payload = JSON.parse(payloadStr);
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Handle different interaction types
    if (payload.type === 'block_actions') {
      for (const action of payload.actions || []) {
        const actionId = action.action_id || '';

        // Vote button from notification — redirect to app
        if (actionId.startsWith('vote_')) {
          // Button with URL already redirects via Slack; nothing needed server-side
          continue;
        }

        // Inline vote: action_id = "cast_vote:<decision_id>:<option_id>"
        if (actionId.startsWith('cast_vote:')) {
          const parts = actionId.split(':');
          const decisionId = parts[1];
          const optionId = parts[2];
          const slackUserId = payload.user?.id;

          if (!decisionId || !optionId || !slackUserId) continue;

          // Find Verdikt user by Slack user (best-effort: match by email via Slack API)
          // For now, respond with a link to vote on the web
          const FRONTEND_URL = Deno.env.get('FRONTEND_URL') || 'https://verdikt.app';

          return new Response(JSON.stringify({
            response_type: 'ephemeral',
            replace_original: false,
            text: `🗳️ Pour voter, rendez-vous sur Verdikt :\n${FRONTEND_URL}/app/decisions/${decisionId}`,
          }), { headers: { 'Content-Type': 'application/json' } });
        }
      }
    }

    // Default: acknowledge
    return new Response('', { status: 200 });

  } catch (error) {
    console.error('Interaction error:', error);
    return new Response(JSON.stringify({
      response_type: 'ephemeral',
      text: '❌ Erreur lors du traitement de l\'interaction.',
    }), { headers: { 'Content-Type': 'application/json' } });
  }
});
