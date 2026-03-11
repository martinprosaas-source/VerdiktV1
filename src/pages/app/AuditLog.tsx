import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    FileText, 
    Vote, 
    MessageSquare, 
    UserPlus, 
    Shield, 
    Clock,
    Settings,
    Filter,
    Download,
    Loader2
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuditLog, useTeam, useAuth } from '../../hooks';
import { Avatar } from '../../components/app/feedback/Avatar';
import type { AuditActionType } from '../../types';

const getActionIcon = (action: AuditActionType) => {
    switch (action) {
        case 'decision_created':
        case 'decision_completed':
            return <Vote className="w-3.5 h-3.5" />;
        case 'vote_cast':
        case 'vote_changed':
            return <Vote className="w-3.5 h-3.5" />;
        case 'argument_added':
            return <MessageSquare className="w-3.5 h-3.5" />;
        case 'deadline_changed':
            return <Clock className="w-3.5 h-3.5" />;
        case 'participant_added':
        case 'member_invited':
            return <UserPlus className="w-3.5 h-3.5" />;
        case 'member_role_changed':
            return <Shield className="w-3.5 h-3.5" />;
        case 'settings_changed':
            return <Settings className="w-3.5 h-3.5" />;
        default:
            return <FileText className="w-3.5 h-3.5" />;
    }
};

const getActionLabel = (action: AuditActionType, t: (key: string) => string) => {
    const key = `app.auditLog.actions.${action}`;
    const translated = t(key);
    return translated !== key ? translated : action;
};

const getActionColor = (action: AuditActionType) => {
    switch (action) {
        case 'decision_created':
            return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400';
        case 'decision_completed':
            return 'bg-blue-500/10 text-blue-600 dark:text-blue-400';
        case 'vote_cast':
        case 'vote_changed':
            return 'bg-purple-500/10 text-purple-600 dark:text-purple-400';
        case 'argument_added':
            return 'bg-orange-500/10 text-orange-600 dark:text-orange-400';
        case 'member_invited':
        case 'participant_added':
            return 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400';
        case 'member_role_changed':
            return 'bg-pink-500/10 text-pink-600 dark:text-pink-400';
        default:
            return 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400';
    }
};

const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', { 
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
};

const formatDate = (date: Date, t: (k: string) => string, locale: string) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return t('common.today');
    if (date.toDateString() === yesterday.toDateString()) return t('common.yesterday');
    
    return new Intl.DateTimeFormat(locale, { 
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    }).format(date);
};

type FilterType = 'all' | 'decisions' | 'votes' | 'team';

export const AuditLog = () => {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const locale = i18n.language?.startsWith('en') ? 'en-GB' : 'fr-FR';
    const [filter, setFilter] = useState<FilterType>('all');
    const [selectedUser, setSelectedUser] = useState<string>('all');
    const { logs, loading } = useAuditLog();
    const { members, loading: loadingMembers } = useTeam();
    const { canManage } = useAuth();

    if (!canManage) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-center">
                <Shield className="w-10 h-10 text-tertiary mb-3 opacity-50" />
                <h2 className="text-base font-semibold text-primary mb-1">{t('app.auditLog.restrictedTitle')}</h2>
                <p className="text-sm text-tertiary">{t('app.auditLog.restrictedDesc')}</p>
            </div>
        );
    }

    const filteredLog = logs.filter(entry => {
        // Filter by type
        if (filter === 'decisions' && !['decision_created', 'decision_completed'].includes(entry.action)) return false;
        if (filter === 'votes' && !['vote_cast', 'vote_changed', 'argument_added'].includes(entry.action)) return false;
        if (filter === 'team' && !['member_invited', 'member_role_changed', 'participant_added'].includes(entry.action)) return false;

        // Filter by user
        if (selectedUser !== 'all' && entry.user_id !== selectedUser) return false;

        return true;
    });

    // Group by date
    const groupedLog = filteredLog.reduce((groups, entry) => {
        const dateKey = new Date(entry.created_at).toDateString();
        if (!groups[dateKey]) groups[dateKey] = [];
        groups[dateKey].push(entry);
        return groups;
    }, {} as Record<string, typeof filteredLog>);

    const exportCSV = () => {
        const headers = [t('app.auditLog.csv.date'), t('app.auditLog.csv.action'), t('app.auditLog.csv.user'), t('app.auditLog.csv.details')];
        const rows = filteredLog.map(entry => [
            formatDateTime(new Date(entry.created_at)),
            getActionLabel(entry.action as AuditActionType, t),
            entry.user ? `${entry.user.first_name} ${entry.user.last_name}` : t('app.auditLog.deletedUser'),
            entry.details
        ]);

        const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `audit-log-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    if (loading || loadingMembers) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-xl font-semibold text-primary">{t('app.auditLog.title')}</h1>
                    <p className="text-sm text-tertiary mt-1">{t('app.auditLog.subtitle')}</p>
                </div>
                <button
                    onClick={exportCSV}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-secondary hover:text-primary bg-card border border-zinc-200 dark:border-white/5 rounded-lg transition-colors"
                >
                    <Download className="w-4 h-4" />
                    {t('app.auditLog.export')}
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-tertiary" />
                    <span className="text-sm text-tertiary">{t('app.auditLog.filterLabel')}</span>
                </div>
                
                <div className="flex items-center gap-1 bg-card border border-zinc-200 dark:border-white/5 rounded-lg p-1">
                    {[
                        { value: 'all', label: t('app.auditLog.tabs.all') },
                        { value: 'decisions', label: t('app.auditLog.tabs.decisions') },
                        { value: 'votes', label: t('app.auditLog.tabs.votes') },
                        { value: 'team', label: t('app.auditLog.tabs.team') },
                    ].map(({ value, label }) => (
                        <button
                            key={value}
                            onClick={() => setFilter(value as FilterType)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                                filter === value
                                    ? 'bg-emerald-500 text-white'
                                    : 'text-secondary hover:text-primary'
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                <select
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                    className="px-3 py-2 text-sm bg-card border border-zinc-200 dark:border-white/5 rounded-lg text-primary"
                >
                    <option value="all">{t('app.auditLog.allMembers')}</option>
                    {members.map(member => (
                        <option key={member.id} value={member.id}>
                            {member.first_name} {member.last_name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Timeline */}
            <div className="space-y-6">
                {Object.entries(groupedLog).map(([dateKey, entries]) => (
                    <div key={dateKey}>
                        <h3 className="text-xs font-medium text-tertiary uppercase tracking-wider mb-3">
                            {formatDate(new Date(dateKey), t, locale)}
                        </h3>
                        <div className="bg-card border border-zinc-200 dark:border-white/5 rounded-lg divide-y divide-zinc-100 dark:divide-white/5">
                            {entries.map((entry) => (
                                <div
                                    key={entry.id}
                                    className="flex items-start gap-3 px-4 py-3 hover:bg-zinc-50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer"
                                    onClick={() => entry.decision_id && navigate(`/app/decisions/${entry.decision_id}`)}
                                >
                                    {/* Avatar */}
                                    {entry.user ? (
                                        <Avatar
                                            firstName={entry.user.first_name}
                                            lastName={entry.user.last_name}
                                            color={entry.user.avatar_color || '#10b981'}
                                            size="sm"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center">
                                            <span className="text-xs text-zinc-500">?</span>
                                        </div>
                                    )}

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="text-sm font-medium text-primary">
                                                {entry.user ? `${entry.user.first_name} ${entry.user.last_name}` : t('app.auditLog.deletedUser')}
                                            </span>
                                            <span className={`px-1.5 py-0.5 text-[10px] font-medium rounded ${getActionColor(entry.action as AuditActionType)}`}>
                                                {getActionLabel(entry.action as AuditActionType, t)}
                                            </span>
                                        </div>
                                        <p className="text-sm text-secondary mt-0.5 line-clamp-2">
                                            {entry.details}
                                        </p>
                                    </div>

                                    {/* Time & Icon */}
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <span className="text-xs text-tertiary">
                                            {new Intl.DateTimeFormat(locale, { 
                                                hour: '2-digit', 
                                                minute: '2-digit' 
                                            }).format(new Date(entry.created_at))}
                                        </span>
                                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${getActionColor(entry.action as AuditActionType)}`}>
                                            {getActionIcon(entry.action as AuditActionType)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {filteredLog.length === 0 && (
                    <div className="text-center py-12">
                        <FileText className="w-10 h-10 text-tertiary mx-auto mb-3" />
                        <p className="text-sm text-tertiary">{t('app.auditLog.empty')}</p>
                    </div>
                )}
            </div>
        </div>
    );
};
