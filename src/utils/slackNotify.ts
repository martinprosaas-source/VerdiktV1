import { supabase } from '../lib/supabase';

export type SlackNotifyType = 'new_decision' | 'new_vote' | 'vote_reminder' | 'decision_complete';

interface SlackNotifyParams {
    teamId: string;
    type: SlackNotifyType;
    data: Record<string, any>;
}

/**
 * Non-blocking call to the slack-notify Edge Function.
 * Silently fails if Slack is not connected or the function errors.
 */
export const sendSlackNotification = async ({ teamId, type, data }: SlackNotifyParams) => {
    try {
        await supabase.functions.invoke('slack-notify', {
            body: { team_id: teamId, type, data },
        });
    } catch (error) {
        console.warn('Slack notification skipped:', error);
    }
};
