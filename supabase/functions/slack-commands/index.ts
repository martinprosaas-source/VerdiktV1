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

    // Verify Slack signature (skip in dev if no secret set)
    if (SLACK_SIGNING_SECRET && !verifySlackSignature(body, timestamp, signature)) {
      return new Response('Invalid signature', { status: 401 });
    }

    const params = new URLSearchParams(body);
    const command = params.get('command') || '';
    const text = (params.get('text') || '').trim();
    const slackTeamId = params.get('team_id') || '';

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Find integration by Slack workspace team_id
    const { data: integration } = await supabase
      .from('team_integrations')
      .select('team_id, settings')
      .eq('provider', 'slack')
      .single();

    if (!integration) {
      return new Response(JSON.stringify({
        response_type: 'ephemeral',
        text: '❌ Verdikt n\'est pas connecté à ce workspace. Connectez-le depuis les paramètres de Verdikt.',
      }), { headers: { 'Content-Type': 'application/json' } });
    }

    const verdiktTeamId = integration.team_id;

    // Handle sub-commands
    if (!text || text === 'help') {
      return new Response(JSON.stringify({
        response_type: 'ephemeral',
        blocks: [
          {
            type: 'header',
            text: { type: 'plain_text', text: '🟢 Verdikt - Commandes', emoji: true },
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: [
                '`/verdikt` — Affiche cette aide',
                '`/verdikt actives` — Liste les décisions en cours',
                '`/verdikt stats` — Statistiques rapides',
              ].join('\n'),
            },
          },
        ],
      }), { headers: { 'Content-Type': 'application/json' } });
    }

    if (text === 'actives' || text === 'active' || text === 'list') {
      const { data: decisions } = await supabase
        .from('decisions')
        .select('id, title, deadline, status, creator:users!decisions_creator_id_fkey(first_name, last_name)')
        .eq('team_id', verdiktTeamId)
        .eq('status', 'active')
        .order('deadline', { ascending: true })
        .limit(10);

      if (!decisions || decisions.length === 0) {
        return new Response(JSON.stringify({
          response_type: 'ephemeral',
          text: '📭 Aucune décision active pour le moment.',
        }), { headers: { 'Content-Type': 'application/json' } });
      }

      const FRONTEND_URL = Deno.env.get('FRONTEND_URL') || 'https://verdikt.app';
      const blocks = [
        {
          type: 'header',
          text: { type: 'plain_text', text: `🗳️ ${decisions.length} décision(s) active(s)`, emoji: true },
        },
        ...decisions.map((d: any) => {
          const deadline = d.deadline
            ? new Date(d.deadline).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
            : 'Pas de deadline';
          const creator = d.creator ? `${d.creator.first_name || ''} ${d.creator.last_name || ''}`.trim() : 'Inconnu';

          return {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*${d.title}*\n📅 ${deadline} • Par ${creator}`,
            },
            accessory: {
              type: 'button',
              text: { type: 'plain_text', text: 'Voter', emoji: true },
              url: `${FRONTEND_URL}/app/decisions/${d.id}`,
              action_id: `vote_${d.id}`,
            },
          };
        }),
        { type: 'divider' },
      ];

      return new Response(JSON.stringify({
        response_type: 'in_channel',
        blocks,
      }), { headers: { 'Content-Type': 'application/json' } });
    }

    if (text === 'stats') {
      const [activeRes, completedRes, totalRes] = await Promise.all([
        supabase.from('decisions').select('id', { count: 'exact', head: true }).eq('team_id', verdiktTeamId).eq('status', 'active'),
        supabase.from('decisions').select('id', { count: 'exact', head: true }).eq('team_id', verdiktTeamId).eq('status', 'completed'),
        supabase.from('votes').select('id', { count: 'exact', head: true }),
      ]);

      return new Response(JSON.stringify({
        response_type: 'ephemeral',
        blocks: [
          {
            type: 'header',
            text: { type: 'plain_text', text: '📊 Statistiques Verdikt', emoji: true },
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: [
                `🟢 Décisions actives : *${activeRes.count || 0}*`,
                `✅ Décisions terminées : *${completedRes.count || 0}*`,
                `🗳️ Votes enregistrés : *${totalRes.count || 0}*`,
              ].join('\n'),
            },
          },
        ],
      }), { headers: { 'Content-Type': 'application/json' } });
    }

    // Unknown command
    return new Response(JSON.stringify({
      response_type: 'ephemeral',
      text: `❓ Commande inconnue : \`${text}\`. Tapez \`/verdikt\` pour voir les commandes disponibles.`,
    }), { headers: { 'Content-Type': 'application/json' } });

  } catch (error) {
    console.error('Slash command error:', error);
    return new Response(JSON.stringify({
      response_type: 'ephemeral',
      text: '❌ Une erreur est survenue. Réessayez plus tard.',
    }), { headers: { 'Content-Type': 'application/json' } });
  }
});
