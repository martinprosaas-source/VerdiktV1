import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

export interface DbNotification {
    id: string;
    user_id: string;
    decision_id: string | null;
    triggered_by_user_id: string | null;
    type: string;
    title: string;
    message: string;
    read: boolean;
    created_at: string;
    triggered_by?: {
        first_name: string;
        last_name: string;
        avatar_color: string | null;
    } | null;
}

export const useNotifications = () => {
    const { profile } = useAuth();
    const [notifications, setNotifications] = useState<DbNotification[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = useCallback(async () => {
        if (!profile?.id) return;

        try {
            const { data, error } = await supabase
                .from('notifications')
                .select(`
                    *,
                    triggered_by:users!notifications_triggered_by_user_id_fkey(first_name, last_name, avatar_color)
                `)
                .eq('user_id', profile.id)
                .order('created_at', { ascending: false })
                .limit(50);

            if (error) throw error;
            setNotifications(data || []);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    }, [profile?.id]);

    useEffect(() => {
        if (profile?.id) {
            fetchNotifications();
        } else {
            setLoading(false);
        }
    }, [profile?.id, fetchNotifications]);

    // Realtime subscription for new notifications
    useEffect(() => {
        if (!profile?.id) return;

        const channel = supabase
            .channel('notifications-realtime')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'notifications',
                    filter: `user_id=eq.${profile.id}`,
                },
                () => {
                    fetchNotifications();
                },
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [profile?.id, fetchNotifications]);

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAsRead = async (notificationId: string) => {
        try {
            await supabase
                .from('notifications')
                .update({ read: true })
                .eq('id', notificationId);

            setNotifications(prev =>
                prev.map(n => n.id === notificationId ? { ...n, read: true } : n),
            );
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        if (!profile?.id) return;

        try {
            await supabase
                .from('notifications')
                .update({ read: true })
                .eq('user_id', profile.id)
                .eq('read', false);

            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    return {
        notifications,
        unreadCount,
        loading,
        markAsRead,
        markAllAsRead,
        refetch: fetchNotifications,
    };
};
