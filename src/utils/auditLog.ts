import { supabase } from '../lib/supabase';

export type AuditAction = 
    | 'decision_created'
    | 'decision_completed'
    | 'vote_cast'
    | 'vote_changed'
    | 'argument_added'
    | 'deadline_changed'
    | 'participant_added'
    | 'member_invited'
    | 'member_role_changed'
    | 'settings_changed';

interface CreateAuditLogParams {
    userId: string;
    action: AuditAction;
    details: string;
    decisionId?: string;
    metadata?: Record<string, any>;
}

export const createAuditLog = async ({
    userId,
    action,
    details,
    decisionId,
    metadata,
}: CreateAuditLogParams) => {
    // Don't attempt to log if no user ID
    if (!userId) {
        console.warn('Cannot create audit log: no user ID provided');
        return;
    }

    try {
        const { error } = await supabase
            .from('audit_logs')
            .insert({
                user_id: userId,
                decision_id: decisionId || null,
                action,
                details,
                metadata: metadata || null,
            });

        if (error) {
            console.error('Error creating audit log:', error);
        }
    } catch (err) {
        console.error('Error creating audit log:', err);
    }
};
