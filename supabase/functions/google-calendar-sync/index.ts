import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function refreshAccessToken(refreshToken: string, clientId: string, clientSecret: string): Promise<string | null> {
  try {
    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data.access_token || null;
  } catch {
    return null;
  }
}

async function getValidAccessToken(
  supabaseAdmin: any,
  userId: string,
  clientId: string,
  clientSecret: string,
): Promise<string | null> {
  const { data: tokenRow } = await supabaseAdmin
    .from('user_google_tokens')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (!tokenRow) return null;

  const now = new Date();
  const expiresAt = tokenRow.token_expires_at ? new Date(tokenRow.token_expires_at) : null;

  if (expiresAt && expiresAt > now) {
    return tokenRow.access_token;
  }

  if (!tokenRow.refresh_token) return null;

  const newToken = await refreshAccessToken(tokenRow.refresh_token, clientId, clientSecret);
  if (!newToken) return null;

  await supabaseAdmin.from('user_google_tokens').update({
    access_token: newToken,
    token_expires_at: new Date(Date.now() + 3600 * 1000).toISOString(),
  }).eq('user_id', userId);

  return newToken;
}

interface CalendarEventPayload {
  decision_id: string;
  title: string;
  description?: string;
  deadline: string; // ISO date string
  participants?: string[];
  app_url?: string;
}

async function createCalendarEvent(
  accessToken: string,
  payload: CalendarEventPayload,
): Promise<{ success: boolean; eventId?: string; error?: string }> {
  const deadlineDate = new Date(payload.deadline);

  const eventBody: any = {
    summary: `[Verdikt] ${payload.title}`,
    description: [
      payload.description || '',
      '',
      payload.app_url ? `Voir la décision : ${payload.app_url}` : '',
    ].filter(Boolean).join('\n'),
    start: {
      dateTime: deadlineDate.toISOString(),
      timeZone: 'Europe/Paris',
    },
    end: {
      dateTime: new Date(deadlineDate.getTime() + 30 * 60 * 1000).toISOString(),
      timeZone: 'Europe/Paris',
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'popup', minutes: 60 },
        { method: 'popup', minutes: 1440 },
      ],
    },
    colorId: '2', // Sage (green-ish)
  };

  if (payload.participants?.length) {
    eventBody.attendees = payload.participants.map((email) => ({ email }));
  }

  const res = await fetch(
    'https://www.googleapis.com/calendar/v3/calendars/primary/events?sendUpdates=all',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventBody),
    },
  );

  if (!res.ok) {
    const err = await res.text();
    console.error('Google Calendar API error:', err);
    return { success: false, error: err };
  }

  const event = await res.json();
  return { success: true, eventId: event.id };
}

async function updateCalendarEvent(
  accessToken: string,
  eventId: string,
  updates: Partial<CalendarEventPayload>,
): Promise<{ success: boolean; error?: string }> {
  const patchBody: any = {};

  if (updates.title) {
    patchBody.summary = `[Verdikt] ${updates.title}`;
  }
  if (updates.deadline) {
    const d = new Date(updates.deadline);
    patchBody.start = { dateTime: d.toISOString(), timeZone: 'Europe/Paris' };
    patchBody.end = { dateTime: new Date(d.getTime() + 30 * 60 * 1000).toISOString(), timeZone: 'Europe/Paris' };
  }
  if (updates.description !== undefined) {
    patchBody.description = updates.description;
  }

  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(patchBody),
    },
  );

  if (!res.ok) {
    const err = await res.text();
    return { success: false, error: err };
  }

  return { success: true };
}

async function deleteCalendarEvent(
  accessToken: string,
  eventId: string,
): Promise<{ success: boolean }> {
  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
    {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );

  return { success: res.ok || res.status === 404 };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const GOOGLE_CLIENT_ID = Deno.env.get('GOOGLE_CLIENT_ID');
    const GOOGLE_CLIENT_SECRET = Deno.env.get('GOOGLE_CLIENT_SECRET');

    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
      return new Response(
        JSON.stringify({ error: 'missing_google_secrets', message: 'GOOGLE_CLIENT_ID ou GOOGLE_CLIENT_SECRET non configuré' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const { action, user_id, decision_id, title, description, deadline, participants, app_url, event_id } = await req.json();

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const accessToken = await getValidAccessToken(supabaseAdmin, user_id, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET);
    if (!accessToken) {
      return new Response(
        JSON.stringify({ error: 'no_google_token', message: 'Aucun token Google Calendar trouvé. Reconnectez-vous avec Google.' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    let result;

    switch (action) {
      case 'create': {
        result = await createCalendarEvent(accessToken, {
          decision_id,
          title,
          description,
          deadline,
          participants,
          app_url,
        });

        if (result.success && result.eventId) {
          await supabaseAdmin.from('decisions').update({
            google_calendar_event_id: result.eventId,
          }).eq('id', decision_id);
        }
        break;
      }

      case 'update': {
        if (!event_id) {
          return new Response(
            JSON.stringify({ error: 'missing_event_id' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
          );
        }
        result = await updateCalendarEvent(accessToken, event_id, { title, description, deadline });
        break;
      }

      case 'delete': {
        if (!event_id) {
          return new Response(
            JSON.stringify({ error: 'missing_event_id' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
          );
        }
        result = await deleteCalendarEvent(accessToken, event_id);
        break;
      }

      default:
        return new Response(
          JSON.stringify({ error: 'invalid_action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    console.error('google-calendar-sync error:', err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
