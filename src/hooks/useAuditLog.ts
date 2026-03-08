import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

export interface AuditLogEntry {
    id: string;
    user_id: string | null;
    decision_id: string | null;
    action: string;
    details: string;
    metadata: any | null;
    created_at: string;
    user?: {
        id: string;
        first_name: string;
        last_name: string;
        email: string;
        avatar_color: string;
    } | null;
}

export const useAuditLog = () => {
    const { profile } = useAuth();
    const [logs, setLogs] = useState<AuditLogEntry[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchLogs = useCallback(async () => {
        if (!profile?.team_id) return;

        try {
            setLoading(true);

            // Single query: get team members + logs with user details
            const [membersResult, logsResult] = await Promise.all([
                supabase
                    .from('users')
                    .select('id')
                    .eq('team_id', profile.team_id),
                supabase
                    .from('audit_logs')
                    .select(`
                        *,
                        user:users!audit_logs_user_id_fkey (
                            id, first_name, last_name, email, avatar_color, team_id
                        )
                    `)
                    .order('created_at', { ascending: false })
                    .limit(100),
            ]);

            const teamMemberIds = new Set((membersResult.data || []).map(m => m.id));
            const teamLogs = (logsResult.data || []).filter(
                (log: any) => log.user_id && teamMemberIds.has(log.user_id)
            );

            setLogs(teamLogs);
        } catch (error: any) {
            console.error('Error fetching audit logs:', error);
        } finally {
            setLoading(false);
        }
    }, [profile?.team_id]);

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    return {
        logs,
        loading,
        refetch: fetchLogs,
    };
};
