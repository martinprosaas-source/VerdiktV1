import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Bell,
    Vote, 
    MessageSquare, 
    Clock, 
    AtSign, 
    CheckCircle,
    UserPlus,
    X,
    Loader2
} from 'lucide-react';
import { useNotifications, type DbNotification } from '../../hooks/useNotifications';
import type { NotificationType } from '../../types';
import { Avatar } from './feedback/Avatar';

const getNotificationIcon = (type: string) => {
    switch (type as NotificationType) {
        case 'vote_cast': return <Vote className="w-3.5 h-3.5" />;
        case 'argument_added': return <MessageSquare className="w-3.5 h-3.5" />;
        case 'deadline_reminder': return <Clock className="w-3.5 h-3.5" />;
        case 'mention': return <AtSign className="w-3.5 h-3.5" />;
        case 'decision_completed': return <CheckCircle className="w-3.5 h-3.5" />;
        case 'new_decision': return <Vote className="w-3.5 h-3.5" />;
        case 'member_joined': return <UserPlus className="w-3.5 h-3.5" />;
        default: return <Bell className="w-3.5 h-3.5" />;
    }
};

const formatTimeAgo = (dateStr: string) => {
    const now = new Date();
    const date = new Date(dateStr);
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'À l\'instant';
    if (minutes < 60) return `Il y a ${minutes}min`;
    if (hours < 24) return `Il y a ${hours}h`;
    return `Il y a ${days}j`;
};

interface NotificationCenterProps {
    isOpen: boolean;
    onClose: () => void;
}

export const NotificationCenter = ({ isOpen, onClose }: NotificationCenterProps) => {
    const navigate = useNavigate();
    const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useNotifications();

    const handleNotificationClick = async (notification: DbNotification) => {
        await markAsRead(notification.id);
        if (notification.decision_id) {
            navigate(`/app/decisions/${notification.decision_id}`);
        }
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/20 dark:bg-black/40 z-40" 
                        onClick={onClose}
                    />

                    {/* Panel */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="fixed left-56 top-0 bottom-0 w-80 bg-card border-r border-zinc-200 dark:border-white/10 shadow-xl z-50 flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-4 border-b border-zinc-200 dark:border-white/5 flex-shrink-0">
                            <div className="flex items-center gap-2">
                                <Bell className="w-4 h-4 text-emerald-500" />
                                <h3 className="text-sm font-semibold text-primary">Notifications</h3>
                                {unreadCount > 0 && (
                                    <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded">
                                        {unreadCount}
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                {unreadCount > 0 && (
                                    <button
                                        onClick={markAllAsRead}
                                        className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline"
                                    >
                                        Tout marquer lu
                                    </button>
                                )}
                                <button 
                                    onClick={onClose}
                                    className="text-tertiary hover:text-primary p-1 hover:bg-zinc-100 dark:hover:bg-white/5 rounded"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Notifications list */}
                        <div className="flex-1 overflow-y-auto">
                            {loading ? (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 className="w-5 h-5 animate-spin text-emerald-500" />
                                </div>
                            ) : notifications.length === 0 ? (
                                <div className="text-center py-12 px-4">
                                    <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-white/5 flex items-center justify-center mx-auto mb-3">
                                        <Bell className="w-5 h-5 text-tertiary" />
                                    </div>
                                    <p className="text-sm text-tertiary">Aucune notification</p>
                                    <p className="text-xs text-tertiary mt-1">Vous serez notifié des nouvelles actions de votre équipe</p>
                                </div>
                            ) : (
                                notifications.map((notification) => (
                                    <button
                                        key={notification.id}
                                        onClick={() => handleNotificationClick(notification)}
                                        className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-zinc-50 dark:hover:bg-white/[0.03] border-b border-zinc-100 dark:border-white/5 last:border-b-0 ${
                                            !notification.read ? 'bg-emerald-500/5' : ''
                                        }`}
                                    >
                                        {/* Icon or Avatar */}
                                        <div className="flex-shrink-0 mt-0.5">
                                            {notification.triggered_by ? (
                                                <Avatar
                                                    firstName={notification.triggered_by.first_name}
                                                    lastName={notification.triggered_by.last_name}
                                                    color={notification.triggered_by.avatar_color || undefined}
                                                    size="xs"
                                                />
                                            ) : (
                                                <div className="w-6 h-6 rounded-full bg-zinc-100 dark:bg-white/5 flex items-center justify-center text-tertiary">
                                                    {getNotificationIcon(notification.type)}
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm leading-snug ${!notification.read ? 'text-primary font-medium' : 'text-secondary'}`}>
                                                {notification.message}
                                            </p>
                                            <p className="text-xs text-tertiary mt-0.5">
                                                {formatTimeAgo(notification.created_at)}
                                            </p>
                                        </div>

                                        {/* Unread indicator */}
                                        {!notification.read && (
                                            <div className="flex-shrink-0 mt-2">
                                                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                            </div>
                                        )}
                                    </button>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-4 py-3 border-t border-zinc-200 dark:border-white/5 flex-shrink-0">
                            <button
                                onClick={() => { navigate('/app/audit-log'); onClose(); }}
                                className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline transition-colors"
                            >
                                Voir tout l'historique →
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
