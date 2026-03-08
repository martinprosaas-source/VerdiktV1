import { supabase } from '../lib/supabase';

interface CreateNotificationParams {
    recipientIds: string[];
    triggeredByUserId: string;
    type: string;
    title: string;
    message: string;
    decisionId?: string;
}

export const createNotifications = async ({
    recipientIds,
    triggeredByUserId,
    type,
    title,
    message,
    decisionId,
}: CreateNotificationParams) => {
    try {
        // Don't notify the person who triggered the action
        const filteredRecipients = recipientIds.filter(id => id !== triggeredByUserId);
        if (filteredRecipients.length === 0) return;

        const rows = filteredRecipients.map(userId => ({
            user_id: userId,
            triggered_by_user_id: triggeredByUserId,
            type,
            title,
            message,
            decision_id: decisionId || null,
            read: false,
        }));

        const { error } = await supabase
            .from('notifications')
            .insert(rows);

        if (error) {
            console.warn('Failed to create notifications:', error);
        }
    } catch (error) {
        console.warn('Notification creation skipped:', error);
    }
};
