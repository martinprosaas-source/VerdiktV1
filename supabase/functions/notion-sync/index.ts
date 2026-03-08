import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DecisionData {
  id: string;
  title: string;
  context?: string;
  status: string;
  category?: string;
  impact?: string;
  urgency?: string;
  deadline?: string;
  created_at?: string;
  creator_name?: string;
  pole_name?: string;
  options?: Array<{ label: string; votes: number; percentage: number }>;
  winning_option?: string;
  total_votes?: number;
  participation_rate?: number;
  stakeholders?: string[];
}

function buildDecisionBlocks(decision: DecisionData) {
  const children: any[] = [];

  // Header callout
  children.push({
    object: 'block',
    type: 'callout',
    callout: {
      icon: { type: 'emoji', emoji: decision.status === 'completed' ? '✅' : '🔄' },
      rich_text: [{
        type: 'text',
        text: { content: decision.status === 'completed' ? 'Décision finalisée' : 'Décision en cours' },
      }],
      color: decision.status === 'completed' ? 'green_background' : 'blue_background',
    },
  });

  // Context
  if (decision.context) {
    children.push({
      object: 'block',
      type: 'heading_2',
      heading_2: {
        rich_text: [{ type: 'text', text: { content: '📋 Contexte' } }],
      },
    });
    children.push({
      object: 'block',
      type: 'paragraph',
      paragraph: {
        rich_text: [{ type: 'text', text: { content: decision.context.substring(0, 2000) } }],
      },
    });
  }

  // Options and results
  if (decision.options && decision.options.length > 0) {
    children.push({
      object: 'block',
      type: 'heading_2',
      heading_2: {
        rich_text: [{ type: 'text', text: { content: '🗳️ Résultats du vote' } }],
      },
    });

    if (decision.winning_option) {
      children.push({
        object: 'block',
        type: 'callout',
        callout: {
          icon: { type: 'emoji', emoji: '🏆' },
          rich_text: [{
            type: 'text',
            text: { content: `Option retenue : ${decision.winning_option}` },
            annotations: { bold: true },
          }],
          color: 'green_background',
        },
      });
    }

    for (const option of decision.options) {
      const bar = '█'.repeat(Math.round(option.percentage / 5)) + '░'.repeat(20 - Math.round(option.percentage / 5));
      const isWinner = option.label === decision.winning_option;
      children.push({
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [
            {
              type: 'text',
              text: { content: `${isWinner ? '🏆 ' : ''}${option.label}` },
              annotations: { bold: isWinner },
            },
            {
              type: 'text',
              text: { content: `\n${bar} ${option.percentage}% (${option.votes} votes)` },
              annotations: { code: true },
            },
          ],
        },
      });
    }
  }

  // Statistics
  children.push({
    object: 'block',
    type: 'heading_2',
    heading_2: {
      rich_text: [{ type: 'text', text: { content: '📊 Statistiques' } }],
    },
  });

  const stats = [
    `Votes totaux : ${decision.total_votes || 0}`,
    `Taux de participation : ${decision.participation_rate || 0}%`,
    decision.creator_name ? `Créée par : ${decision.creator_name}` : null,
    decision.pole_name ? `Pôle : ${decision.pole_name}` : null,
    decision.deadline ? `Date limite : ${new Date(decision.deadline).toLocaleDateString('fr-FR')}` : null,
    decision.created_at ? `Créée le : ${new Date(decision.created_at).toLocaleDateString('fr-FR')}` : null,
  ].filter(Boolean);

  for (const stat of stats) {
    children.push({
      object: 'block',
      type: 'bulleted_list_item',
      bulleted_list_item: {
        rich_text: [{ type: 'text', text: { content: stat! } }],
      },
    });
  }

  // Divider + footer
  children.push({
    object: 'block',
    type: 'divider',
    divider: {},
  });

  children.push({
    object: 'block',
    type: 'paragraph',
    paragraph: {
      rich_text: [{
        type: 'text',
        text: { content: `Exporté depuis Verdikt le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}` },
        annotations: { italic: true, color: 'gray' },
      }],
    },
  });

  return children;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const { team_id, decision } = await req.json() as { team_id: string; decision: DecisionData };

    if (!team_id || !decision) {
      throw new Error('team_id and decision are required');
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Fetch Notion integration
    const { data: integration, error: intError } = await supabase
      .from('team_integrations')
      .select('*')
      .eq('team_id', team_id)
      .eq('provider', 'notion')
      .single();

    if (intError || !integration) {
      return new Response(
        JSON.stringify({ error: 'Notion not connected', skipped: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 },
      );
    }

    const accessToken = integration.access_token;
    const databaseId = integration.settings?.database_id;

    // Build page properties
    const statusEmoji = decision.status === 'completed' ? '✅' : '🔄';
    const properties: Record<string, any> = {
      'Décision': {
        title: [{
          text: { content: `${statusEmoji} ${decision.title}` },
        }],
      },
    };

    // If we have a database, add database properties
    if (databaseId) {
      properties['Statut'] = {
        select: {
          name: decision.status === 'completed' ? 'Finalisée' : decision.status === 'active' ? 'En cours' : 'Brouillon',
        },
      };
      if (decision.category) {
        properties['Catégorie'] = { select: { name: decision.category } };
      }
      if (decision.pole_name) {
        properties['Pôle'] = { select: { name: decision.pole_name } };
      }
      if (decision.winning_option) {
        properties['Résultat'] = {
          rich_text: [{ text: { content: decision.winning_option } }],
        };
      }
      if (decision.participation_rate !== undefined) {
        properties['Participation'] = { number: decision.participation_rate };
      }
      if (decision.deadline) {
        properties['Date limite'] = { date: { start: decision.deadline.split('T')[0] } };
      }
      if (decision.created_at) {
        properties['Créée le'] = { date: { start: decision.created_at.split('T')[0] } };
      }
    }

    const pageContent = buildDecisionBlocks(decision);

    let notionResponse;
    let pageUrl: string | null = null;

    if (databaseId) {
      // Create page in database
      notionResponse = await fetch('https://api.notion.com/v1/pages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Notion-Version': '2022-06-28',
        },
        body: JSON.stringify({
          parent: { database_id: databaseId },
          properties,
          children: pageContent,
        }),
      });
    } else {
      // Create standalone page in workspace
      notionResponse = await fetch('https://api.notion.com/v1/pages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Notion-Version': '2022-06-28',
        },
        body: JSON.stringify({
          parent: { page_id: await getOrCreateVerdiktPage(accessToken, integration) },
          properties: {
            title: [{
              text: { content: `${statusEmoji} ${decision.title}` },
            }],
          },
          children: pageContent,
        }),
      });
    }

    const result = await notionResponse.json();

    if (result.object === 'error') {
      console.error('Notion API error:', result);
      throw new Error(`Notion API: ${result.message}`);
    }

    pageUrl = result.url;

    return new Response(
      JSON.stringify({ success: true, page_url: pageUrl, page_id: result.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 },
    );
  } catch (error) {
    console.error('Notion sync error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 },
    );
  }
});

async function getOrCreateVerdiktPage(accessToken: string, integration: any): Promise<string> {
  // Check if we already have a parent page stored
  if (integration.settings?.verdikt_page_id) {
    try {
      const checkResponse = await fetch(`https://api.notion.com/v1/pages/${integration.settings.verdikt_page_id}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Notion-Version': '2022-06-28',
        },
      });
      const checkResult = await checkResponse.json();
      if (checkResult.object === 'page' && !checkResult.archived) {
        return integration.settings.verdikt_page_id;
      }
    } catch {
      // Page might have been deleted, create a new one
    }
  }

  // Search for existing Verdikt page
  const searchResponse = await fetch('https://api.notion.com/v1/search', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28',
    },
    body: JSON.stringify({
      query: 'Verdikt - Décisions',
      filter: { property: 'object', value: 'page' },
    }),
  });

  const searchResult = await searchResponse.json();
  const existingPage = searchResult.results?.find(
    (p: any) => p.properties?.title?.title?.[0]?.plain_text === 'Verdikt - Décisions' && !p.archived,
  );

  if (existingPage) {
    // Save for future reference
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    await supabase.from('team_integrations')
      .update({ settings: { ...integration.settings, verdikt_page_id: existingPage.id } })
      .eq('id', integration.id);
    return existingPage.id;
  }

  // Create new parent page
  const createResponse = await fetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28',
    },
    body: JSON.stringify({
      parent: { type: 'workspace', workspace: true },
      properties: {
        title: [{ text: { content: 'Verdikt - Décisions' } }],
      },
      icon: { type: 'emoji', emoji: '⚖️' },
      children: [
        {
          object: 'block',
          type: 'callout',
          callout: {
            icon: { type: 'emoji', emoji: '📌' },
            rich_text: [{
              type: 'text',
              text: { content: 'Cette page contient toutes les décisions exportées depuis Verdikt. Ne la supprimez pas.' },
            }],
            color: 'blue_background',
          },
        },
        { object: 'block', type: 'divider', divider: {} },
      ],
    }),
  });

  const newPage = await createResponse.json();

  if (newPage.object === 'error') {
    console.error('Failed to create Verdikt page:', newPage);
    throw new Error(`Cannot create Verdikt parent page: ${newPage.message}`);
  }

  // Save the page ID
  const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  await supabase.from('team_integrations')
    .update({ settings: { ...integration.settings, verdikt_page_id: newPage.id } })
    .eq('id', integration.id);

  return newPage.id;
}
