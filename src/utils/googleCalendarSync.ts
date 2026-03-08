import { supabase } from '../lib/supabase';

interface SyncToCalendarParams {
    decisionId: string;
    title: string;
    description?: string;
    deadline: string;
    participants?: string[];
}

export async function addToGoogleCalendar(params: SyncToCalendarParams): Promise<{ success: boolean; error?: string }> {
    try {
        const { data: authData } = await supabase.auth.getUser();
        if (!authData?.user) return { success: false, error: 'Non authentifié' };

        const appUrl = `${window.location.origin}/app/decisions/${params.decisionId}`;

        const { data, error } = await supabase.functions.invoke('google-calendar-sync', {
            body: {
                action: 'create',
                user_id: authData.user.id,
                decision_id: params.decisionId,
                title: params.title,
                description: params.description,
                deadline: params.deadline,
                participants: params.participants,
                app_url: appUrl,
            },
        });

        if (error) throw error;
        if (data?.error === 'no_google_token') {
            return { success: false, error: 'google_not_connected' };
        }

        return { success: data?.success ?? false, error: data?.error };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}

export async function updateGoogleCalendarEvent(
    eventId: string,
    updates: { title?: string; description?: string; deadline?: string },
): Promise<{ success: boolean }> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { success: false };

        const { data } = await supabase.functions.invoke('google-calendar-sync', {
            body: {
                action: 'update',
                user_id: user.id,
                event_id: eventId,
                ...updates,
            },
        });

        return { success: data?.success ?? false };
    } catch {
        return { success: false };
    }
}

export async function deleteGoogleCalendarEvent(eventId: string): Promise<{ success: boolean }> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { success: false };

        const { data } = await supabase.functions.invoke('google-calendar-sync', {
            body: {
                action: 'delete',
                user_id: user.id,
                event_id: eventId,
            },
        });

        return { success: data?.success ?? false };
    } catch {
        return { success: false };
    }
}

export async function hasGoogleCalendarConnected(): Promise<boolean> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return false;

        const { data } = await supabase
            .from('user_google_tokens')
            .select('user_id, calendar_enabled')
            .eq('user_id', user.id)
            .single();

        return !!data && data.calendar_enabled !== false;
    } catch {
        return false;
    }
}
