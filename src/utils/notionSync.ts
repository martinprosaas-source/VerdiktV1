import { supabase } from '../lib/supabase';

interface NotionSyncParams {
    teamId: string;
    decision: {
        id: string;
        title: string;
        context?: string | null;
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
    };
}

interface NotionSyncResult {
    success: boolean;
    page_url?: string;
    page_id?: string;
    error?: string;
    skipped?: boolean;
}

export const exportToNotion = async ({ teamId, decision }: NotionSyncParams): Promise<NotionSyncResult> => {
    try {
        const { data, error } = await supabase.functions.invoke('notion-sync', {
            body: { team_id: teamId, decision },
        });

        if (error) throw error;
        return data as NotionSyncResult;
    } catch (error: any) {
        console.warn('Notion export failed:', error);
        return { success: false, error: error.message };
    }
};
