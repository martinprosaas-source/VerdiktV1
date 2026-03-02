import { useState } from 'react';
import { UserPlus, MoreVertical, Clock, Mail, X, RefreshCw } from 'lucide-react';
import { Avatar } from '../../components/app/feedback/Avatar';
import { InviteModal } from '../../components/app/InviteModal';
import { teamMembers, pendingInvites, poles } from '../../data/mockData';

const getRoleBadge = (role: string) => {
    const styles = {
        owner: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
        admin: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
        member: 'bg-zinc-100 dark:bg-white/5 text-tertiary border-zinc-200 dark:border-white/10',
    };
    
    const labels = {
        owner: 'Owner',
        admin: 'Admin',
        member: 'Membre',
    };

    return (
        <span className={`px-2 py-0.5 text-xs font-medium rounded border ${styles[role as keyof typeof styles] || styles.member}`}>
            {labels[role as keyof typeof labels] || role}
        </span>
    );
};

const getPoleBadge = (poleId?: string) => {
    if (!poleId) return null;
    
    const pole = poles.find(p => p.id === poleId);
    if (!pole) return null;

    const colorStyles: Record<string, string> = {
        purple: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
        pink: 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20',
        blue: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
        emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
        orange: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
        cyan: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
        yellow: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20',
        red: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
    };

    return (
        <span className={`px-2 py-0.5 text-xs font-medium rounded border ${colorStyles[pole.color] || colorStyles.blue}`}>
            {pole.name.replace('Pôle ', '')}
        </span>
    );
};

const getStatusBadge = (status: 'pending' | 'expired') => {
    if (status === 'expired') {
        return (
            <span className="px-2 py-0.5 text-xs font-medium rounded border bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20">
                Expiré
            </span>
        );
    }
    return (
        <span className="px-2 py-0.5 text-xs font-medium rounded border bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20">
            En attente
        </span>
    );
};

const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', { 
        day: 'numeric',
        month: 'short'
    }).format(date);
};

const formatRelativeDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return "Aujourd'hui";
    if (days === 1) return "Hier";
    return `Il y a ${days} jours`;
};

export const Team = () => {
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'members' | 'pending'>('members');

    const isExpired = (expiresAt: Date) => new Date() > expiresAt;

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div>
                    <h1 className="text-lg sm:text-xl font-semibold text-primary">Équipe</h1>
                    <p className="text-sm text-tertiary">
                        {teamMembers.length} membres • {pendingInvites.length} en attente
                    </p>
                </div>
                <button 
                    onClick={() => setIsInviteModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 sm:py-1.5 bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-medium rounded-lg transition-colors"
                >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Inviter</span>
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 p-1 bg-zinc-100 dark:bg-white/5 rounded-lg mb-4 w-fit">
                <button
                    onClick={() => setActiveTab('members')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                        activeTab === 'members'
                            ? 'bg-white dark:bg-white/10 text-primary shadow-sm'
                            : 'text-tertiary hover:text-secondary'
                    }`}
                >
                    Membres ({teamMembers.length})
                </button>
                <button
                    onClick={() => setActiveTab('pending')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-2 ${
                        activeTab === 'pending'
                            ? 'bg-white dark:bg-white/10 text-primary shadow-sm'
                            : 'text-tertiary hover:text-secondary'
                    }`}
                >
                    En attente
                    {pendingInvites.length > 0 && (
                        <span className="px-1.5 py-0.5 text-xs bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-full">
                            {pendingInvites.length}
                        </span>
                    )}
                </button>
            </div>

            {activeTab === 'members' ? (
                <>
                    {/* Mobile Cards View - Members */}
            <div className="sm:hidden space-y-3">
                {teamMembers.map((member) => (
                    <div 
                        key={member.id} 
                        className="bg-card border border-zinc-200 dark:border-white/5 rounded-lg p-4"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Avatar 
                                    firstName={member.firstName}
                                    lastName={member.lastName}
                                    color={member.avatarColor}
                                    size="sm"
                                />
                                <div>
                                    <p className="text-sm font-medium text-primary">
                                        {member.firstName} {member.lastName}
                                    </p>
                                    <p className="text-xs text-tertiary">{member.email}</p>
                                </div>
                            </div>
                            <button className="p-2 text-tertiary hover:text-primary transition-colors rounded">
                                <MoreVertical className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-200 dark:border-white/5">
                            <div className="flex flex-wrap items-center gap-2">
                                {getRoleBadge(member.role)}
                                {getPoleBadge(member.poleId)}
                            </div>
                            <span className="text-xs text-tertiary">
                                {formatDate(member.joinedAt)}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

                    {/* Desktop Table View - Members */}
            <div className="hidden sm:block bg-card border border-zinc-200 dark:border-white/5 rounded-lg overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-zinc-200 dark:border-white/5">
                            <th className="text-left text-[10px] font-medium text-tertiary uppercase tracking-wider px-4 py-3">
                                Membre
                            </th>
                            <th className="text-left text-[10px] font-medium text-tertiary uppercase tracking-wider px-4 py-3 hidden md:table-cell">
                                Email
                            </th>
                            <th className="text-left text-[10px] font-medium text-tertiary uppercase tracking-wider px-4 py-3">
                                Rôle
                            </th>
                            <th className="text-left text-[10px] font-medium text-tertiary uppercase tracking-wider px-4 py-3 hidden xl:table-cell">
                                Pôle
                            </th>
                            <th className="text-left text-[10px] font-medium text-tertiary uppercase tracking-wider px-4 py-3 hidden lg:table-cell">
                                Ajouté
                            </th>
                            <th className="w-10"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 dark:divide-white/5">
                        {teamMembers.map((member) => (
                            <tr key={member.id} className="hover:bg-zinc-50 dark:hover:bg-white/[0.02] transition-colors">
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <Avatar 
                                            firstName={member.firstName}
                                            lastName={member.lastName}
                                            color={member.avatarColor}
                                            size="sm"
                                        />
                                        <span className="text-sm font-medium text-primary">
                                            {member.firstName} {member.lastName}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 hidden md:table-cell">
                                    <span className="text-sm text-tertiary">{member.email}</span>
                                </td>
                                <td className="px-4 py-3">
                                    {getRoleBadge(member.role)}
                                </td>
                                <td className="px-4 py-3 hidden xl:table-cell">
                                    {getPoleBadge(member.poleId)}
                                </td>
                                <td className="px-4 py-3 text-sm text-tertiary hidden lg:table-cell">
                                    {formatDate(member.joinedAt)}
                                </td>
                                <td className="px-4 py-3">
                                    <button className="p-1 text-tertiary hover:text-primary transition-colors rounded">
                                        <MoreVertical className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
                </>
            ) : (
                <>
                    {/* Pending Invites - Mobile */}
                    <div className="sm:hidden space-y-3">
                        {pendingInvites.length === 0 ? (
                            <div className="text-center py-8 text-tertiary">
                                <Mail className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                <p className="text-sm">Aucune invitation en attente</p>
                            </div>
                        ) : (
                            pendingInvites.map((invite) => (
                                <div 
                                    key={invite.id} 
                                    className="bg-card border border-zinc-200 dark:border-white/5 rounded-lg p-4"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-amber-500/10 flex items-center justify-center">
                                                <Clock className="w-4 h-4 text-amber-500" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-primary truncate max-w-[180px]">
                                                    {invite.email}
                                                </p>
                                                <p className="text-xs text-tertiary">
                                                    Invité par {invite.invitedBy.firstName}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button 
                                                className="p-1.5 text-tertiary hover:text-emerald-500 transition-colors rounded hover:bg-emerald-500/10"
                                                title="Renvoyer l'invitation"
                                            >
                                                <RefreshCw className="w-4 h-4" />
                                            </button>
                                            <button 
                                                className="p-1.5 text-tertiary hover:text-red-500 transition-colors rounded hover:bg-red-500/10"
                                                title="Annuler l'invitation"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-200 dark:border-white/5">
                                        <div className="flex items-center gap-2">
                                            {getStatusBadge(isExpired(invite.expiresAt) ? 'expired' : 'pending')}
                                            {getRoleBadge(invite.role)}
                                        </div>
                                        <span className="text-xs text-tertiary">
                                            {formatRelativeDate(invite.invitedAt)}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Pending Invites - Desktop */}
                    <div className="hidden sm:block bg-card border border-zinc-200 dark:border-white/5 rounded-lg overflow-hidden">
                        {pendingInvites.length === 0 ? (
                            <div className="text-center py-12 text-tertiary">
                                <Mail className="w-10 h-10 mx-auto mb-3 opacity-50" />
                                <p className="text-sm">Aucune invitation en attente</p>
                                <p className="text-xs mt-1">Les nouvelles invitations apparaîtront ici</p>
                            </div>
                        ) : (
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-zinc-200 dark:border-white/5">
                                        <th className="text-left text-[10px] font-medium text-tertiary uppercase tracking-wider px-4 py-3">
                                            Email
                                        </th>
                                        <th className="text-left text-[10px] font-medium text-tertiary uppercase tracking-wider px-4 py-3">
                                            Rôle
                                        </th>
                                        <th className="text-left text-[10px] font-medium text-tertiary uppercase tracking-wider px-4 py-3 hidden md:table-cell">
                                            Invité par
                                        </th>
                                        <th className="text-left text-[10px] font-medium text-tertiary uppercase tracking-wider px-4 py-3">
                                            Statut
                                        </th>
                                        <th className="w-24"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-200 dark:divide-white/5">
                                    {pendingInvites.map((invite) => (
                                        <tr key={invite.id} className="hover:bg-zinc-50 dark:hover:bg-white/[0.02] transition-colors">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                                                        <Clock className="w-4 h-4 text-amber-500" />
                                                    </div>
                                                    <span className="text-sm text-primary truncate max-w-[200px]">
                                                        {invite.email}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                {getRoleBadge(invite.role)}
                                            </td>
                                            <td className="px-4 py-3 hidden md:table-cell">
                                                <span className="text-sm text-tertiary">
                                                    {invite.invitedBy.firstName} {invite.invitedBy.lastName}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex flex-col gap-0.5">
                                                    {getStatusBadge(isExpired(invite.expiresAt) ? 'expired' : 'pending')}
                                                    <span className="text-[10px] text-tertiary">
                                                        {formatRelativeDate(invite.invitedAt)}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-1">
                                                    <button 
                                                        className="p-1.5 text-tertiary hover:text-emerald-500 transition-colors rounded hover:bg-emerald-500/10"
                                                        title="Renvoyer l'invitation"
                                                    >
                                                        <RefreshCw className="w-4 h-4" />
                                                    </button>
                                                    <button 
                                                        className="p-1.5 text-tertiary hover:text-red-500 transition-colors rounded hover:bg-red-500/10"
                                                        title="Annuler l'invitation"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </>
            )}

            {/* Invite Modal */}
            <InviteModal 
                isOpen={isInviteModalOpen} 
                onClose={() => setIsInviteModalOpen(false)} 
            />
        </div>
    );
};
