import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type NotificationType = 'new_decision' | 'new_vote' | 'vote_reminder' | 'decision_complete';

interface NotifyPayload {
  team_id: string;
  type: NotificationType;
  data: Record<string, any>;
}

// ─── Block Kit Templates ───────────────────────────────────────────

function buildNewDecisionBlocks(data: Record<string, any>) {
  const optionLines = (data.options || [])
    .map((opt: string, i: number) => `${i + 1}. ${opt}`)
    .join('\n');

  const deadlineText = data.deadline
    ? `\n📅 *Deadline :* ${new Date(data.deadline).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}`
    : '';

  return [
    {
      type: 'header',
      text: { type: 'plain_text', text: '🆕 Nouvelle décision', emoji: true },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*${data.title}*\n\n${data.context || '_Pas de contexte_'}`,
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `📋 *Options :*\n${optionLines}${deadlineText}`,
      },
    },
    {
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: `Créée par *${data.creator_name || 'Un membre'}*${data.pole_name ? ` • Pôle ${data.pole_name}` : ''}`,
        },
      ],
    },
    {
      type: 'actions',
      elements: [
        {
          type: 'button',
          text: { type: 'plain_text', text: '🗳️ Voter sur Verdikt', emoji: true },
          url: `${data.app_url || 'https://verdikt.app'}/app/decisions/${data.decision_id}`,
          style: 'primary',
        },
      ],
    },
    { type: 'divider' },
  ];
}

function buildNewVoteBlocks(data: Record<string, any>) {
  const progressBar = (current: number, total: number) => {
    const filled = total > 0 ? Math.round((current / total) * 10) : 0;
    return '▓'.repeat(filled) + '░'.repeat(10 - filled);
  };

  return [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `🗳️ *${data.voter_name || 'Un membre'}* a voté sur *${data.decision_title}*`,
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `Option choisie : *${data.option_label}*\n\n${progressBar(data.votes_count || 0, data.total_participants || 0)} ${data.votes_count || 0}/${data.total_participants || 0} votes`,
      },
    },
    {
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: data.all_voted
            ? '✅ Tous les participants ont voté !'
            : `⏳ ${(data.total_participants || 0) - (data.votes_count || 0)} vote(s) restant(s)`,
        },
      ],
    },
    { type: 'divider' },
  ];
}

function buildVoteReminderBlocks(data: Record<string, any>) {
  const timeLeft = data.hours_left
    ? data.hours_left < 24
      ? `${data.hours_left}h`
      : `${Math.round(data.hours_left / 24)} jour(s)`
    : 'bientôt';

  return [
    {
      type: 'header',
      text: { type: 'plain_text', text: '⏰ Rappel : votez !', emoji: true },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `La décision *${data.decision_title}* expire dans *${timeLeft}* !\n\n📊 ${data.votes_count || 0}/${data.total_participants || 0} votes reçus`,
      },
    },
    {
      type: 'actions',
      elements: [
        {
          type: 'button',
          text: { type: 'plain_text', text: '🗳️ Voter maintenant', emoji: true },
          url: `${data.app_url || 'https://verdikt.app'}/app/decisions/${data.decision_id}`,
          style: 'primary',
        },
      ],
    },
    { type: 'divider' },
  ];
}

function buildDecisionCompleteBlocks(data: Record<string, any>) {
  const resultLines = (data.results || [])
    .map((r: any) => `• ${r.label} — *${r.votes} vote(s)* ${r.winner ? '🏆' : ''}`)
    .join('\n');

  return [
    {
      type: 'header',
      text: { type: 'plain_text', text: '✅ Décision terminée', emoji: true },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*${data.decision_title}*\n\n${resultLines}`,
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `📊 *${data.total_votes || 0}* votes au total • Participation : *${data.participation_rate || 0}%*`,
      },
    },
    {
      type: 'context',
      elements: [
        { type: 'mrkdwn', text: `Option gagnante : *${data.winning_option || '—'}*` },
      ],
    },
    {
      type: 'actions',
      elements: [
        {
          type: 'button',
          text: { type: 'plain_text', text: '📄 Voir les détails', emoji: true },
          url: `${data.app_url || 'https://verdikt.app'}/app/decisions/${data.decision_id}`,
        },
      ],
    },
    { type: 'divider' },
  ];
}

// ─── Main handler ──────────────────────────────────────────────────

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const payload: NotifyPayload = await req.json();
    const { team_id, type, data } = payload;

    if (!team_id || !type) {
      throw new Error('team_id and type are required');
    }

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Get Slack integration for this team
    const { data: integration, error: intError } = await supabase
      .from('team_integrations')
      .select('*')
      .eq('team_id', team_id)
      .eq('provider', 'slack')
      .single();

    if (intError || !integration) {
      return new Response(
        JSON.stringify({ skipped: true, reason: 'no_slack_integration' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 },
      );
    }

    // Check if this notification type is enabled
    const settingKey = `notify_${type}`;
    if (integration.settings?.[settingKey] === false) {
      return new Response(
        JSON.stringify({ skipped: true, reason: 'notification_disabled' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 },
      );
    }

    // Build blocks based on type
    let blocks: any[];
    let text: string;

    switch (type) {
      case 'new_decision':
        blocks = buildNewDecisionBlocks(data);
        text = `🆕 Nouvelle décision : ${data.title}`;
        break;
      case 'new_vote':
        blocks = buildNewVoteBlocks(data);
        text = `🗳️ ${data.voter_name} a voté sur "${data.decision_title}"`;
        break;
      case 'vote_reminder':
        blocks = buildVoteReminderBlocks(data);
        text = `⏰ Rappel : votez sur "${data.decision_title}"`;
        break;
      case 'decision_complete':
        blocks = buildDecisionCompleteBlocks(data);
        text = `✅ Décision terminée : ${data.decision_title}`;
        break;
      default:
        throw new Error(`Unknown notification type: ${type}`);
    }

    // Determine channel: use integration's channel_id or fall back to webhook
    const channelId = integration.channel_id;

    if (channelId && integration.access_token) {
      // Post via chat.postMessage (preferred, more flexible)
      const slackRes = await fetch('https://slack.com/api/chat.postMessage', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${integration.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          channel: channelId,
          text,
          blocks,
          unfurl_links: false,
        }),
      });

      const slackData = await slackRes.json();

      if (!slackData.ok) {
        console.error('Slack API error:', slackData.error);
        return new Response(
          JSON.stringify({ error: slackData.error }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 },
        );
      }
    } else if (integration.webhook_url) {
      // Fallback: incoming webhook
      await fetch(integration.webhook_url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, blocks }),
      });
    } else {
      return new Response(
        JSON.stringify({ skipped: true, reason: 'no_channel_or_webhook' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 },
      );
    }

    return new Response(
      JSON.stringify({ success: true, type }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 },
    );
  } catch (error) {
    console.error('Slack notify error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 },
    );
  }
});
