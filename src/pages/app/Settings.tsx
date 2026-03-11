import { useState, useEffect, useRef } from 'react';
import { Save, Shield, Info, Plug, CheckCircle2, Clock, Loader2, Unplug, LogOut, Send, X } from 'lucide-react';
import { Avatar } from '../../components/app/feedback/Avatar';
import { useAuth, useTeam, useIntegrations } from '../../hooks';
import { SlackLogo, NotionLogo, GoogleCalendarLogo } from '../../components/icons/IntegrationLogos';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { hasGoogleCalendarConnected } from '../../utils/googleCalendarSync';
import { supabase } from '../../lib/supabase';

const permissions = [
    { id: 'create_decisions', label: 'Créer des décisions', description: 'Peut créer de nouvelles décisions', roles: ['owner', 'admin', 'member'] },
    { id: 'edit_decisions', label: 'Modifier les décisions', description: 'Peut modifier n\'importe quelle décision', roles: ['owner', 'admin'] },
    { id: 'delete_decisions', label: 'Supprimer les décisions', description: 'Peut supprimer les décisions', roles: ['owner', 'admin'] },
    { id: 'manage_members', label: 'Gérer les membres', description: 'Peut inviter/retirer des membres', roles: ['owner', 'admin'] },
    { id: 'change_roles', label: 'Changer les rôles', description: 'Peut modifier les rôles des membres', roles: ['owner'] },
    { id: 'view_audit', label: 'Voir l\'audit log', description: 'Accès à l\'historique complet des actions', roles: ['owner', 'admin'] },
    { id: 'export_data', label: 'Exporter les données', description: 'Peut exporter les données de l\'équipe', roles: ['owner', 'admin'] },
];

const integrationDefs = [
    {
        id: 'slack',
        name: 'Slack',
        description: 'Recevez des notifications et participez aux décisions directement depuis Slack.',
        icon: <SlackLogo className="w-7 h-7 object-contain" />,
        bgColor: 'bg-zinc-100 dark:bg-white/5',
        available: true,
        features: [
            'Notifications en temps réel',
            'Voter depuis Slack',
            'Commandes /verdikt',
            'Résumés automatiques',
        ],
    },
    {
        id: 'notion',
        name: 'Notion',
        description: 'Exportez automatiquement vos décisions finalisées vers Notion.',
        icon: <NotionLogo className="w-7 h-7 object-contain" />,
        bgColor: 'bg-zinc-100 dark:bg-white/5',
        available: true,
        features: [
            'Export automatique des décisions',
            'Page Notion détaillée avec résultats',
            'Export manuel depuis chaque décision',
            'Historique complet',
        ],
    },
    {
        id: 'google_calendar',
        name: 'Google Calendar',
        description: 'Ajoutez les deadlines de vos décisions à votre Google Calendar avec rappels automatiques.',
        icon: <GoogleCalendarLogo className="w-7 h-7 object-contain" />,
        bgColor: 'bg-zinc-100 dark:bg-white/5',
        available: true,
        isUserLevel: true,
        features: [
            'Événements créés automatiquement',
            'Rappels 1h et 24h avant',
            'Participants invités',
            'Lien direct vers la décision',
        ],
    },
];

const SuggestIntegrationCard = () => {
    const [open, setOpen] = useState(false);
    const [tool, setTool] = useState('');
    const [sent, setSent] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleOpen = () => {
        setOpen(true);
        setSent(false);
        setTool('');
        setTimeout(() => inputRef.current?.focus(), 50);
    };

    const handleSend = () => {
        if (!tool.trim()) return;
        const subject = encodeURIComponent(`Suggestion d'intégration : ${tool.trim()}`);
        const body = encodeURIComponent(`Bonjour,\n\nJe souhaiterais connecter ${tool.trim()} à Verdikt.\n\nMerci !`);
        window.open(`mailto:contact@verdikt.dev?subject=${subject}&body=${body}`, '_blank');
        setSent(true);
        setOpen(false);
        setTool('');
    };

    return (
        <section className="bg-card border border-dashed border-zinc-300 dark:border-white/10 rounded-xl p-6 text-center">
            <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-white/5 flex items-center justify-center mx-auto mb-3">
                <Plug className="w-5 h-5 text-tertiary" />
            </div>
            <h3 className="text-sm font-medium text-primary mb-1">Une intégration manquante ?</h3>
            <p className="text-xs text-tertiary mb-4">
                Dites-nous quels outils vous aimeriez connecter à Verdikt.
            </p>

            {sent ? (
                <div className="flex items-center justify-center gap-2 text-emerald-500 text-sm font-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    Suggestion envoyée, merci !
                </div>
            ) : open ? (
                <div className="flex items-center gap-2 max-w-xs mx-auto">
                    <input
                        ref={inputRef}
                        type="text"
                        value={tool}
                        onChange={e => setTool(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') handleSend(); if (e.key === 'Escape') setOpen(false); }}
                        placeholder="Ex : Jira, Linear, HubSpot…"
                        className="flex-1 px-3 py-1.5 text-sm bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-lg text-primary placeholder:text-tertiary focus:outline-none focus:border-emerald-500"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!tool.trim()}
                        className="p-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <Send className="w-3.5 h-3.5" />
                    </button>
                    <button
                        onClick={() => setOpen(false)}
                        className="p-1.5 text-tertiary hover:text-primary hover:bg-zinc-100 dark:hover:bg-white/5 rounded-lg transition-colors"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>
            ) : (
                <button
                    onClick={handleOpen}
                    className="px-4 py-2 bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 text-secondary text-sm font-medium rounded-lg transition-colors"
                >
                    Suggérer une intégration
                </button>
            )}
        </section>
    );
};

export const Settings = () => {
    const [activeTab, setActiveTab] = useState<'profile' | 'workspace' | 'permissions' | 'integrations'>('profile');
    const { profile, loading, signOut, refreshProfile } = useAuth();
    const navigate = useNavigate();
    const { members, team, refetch: refetchTeam } = useTeam();
    const { getIntegration, connectSlack, connectNotion, disconnectIntegration, refetch: refetchIntegrations } = useIntegrations();
    const [searchParams, setSearchParams] = useSearchParams();
    const [slackConnecting, setSlackConnecting] = useState(false);
    const [notionConnecting, setNotionConnecting] = useState(false);
    const [slackMessage, setSlackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [notionMessage, setNotionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [gcalConnected, setGcalConnected] = useState(false);
    const [gcalMessage, setGcalMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // Profile form state
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [profileSaving, setProfileSaving] = useState(false);
    const [profileMessage, setProfileMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // Workspace form state
    const [teamName, setTeamName] = useState('');
    const [workspaceSaving, setWorkspaceSaving] = useState(false);
    const [workspaceMessage, setWorkspaceMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // Sync form state when profile/team loads
    useEffect(() => {
        if (profile) {
            setFirstName(profile.first_name || '');
            setLastName(profile.last_name || '');
        }
    }, [profile?.id]);

    useEffect(() => {
        if (team) {
            setTeamName(team.name || '');
        }
    }, [team?.id]);

    const handleSaveProfile = async () => {
        if (!profile) return;
        setProfileSaving(true);
        setProfileMessage(null);
        try {
            const { error } = await supabase
                .from('users')
                .update({ first_name: firstName.trim(), last_name: lastName.trim() })
                .eq('id', profile.id);
            if (error) throw error;
            await refreshProfile();
            setProfileMessage({ type: 'success', text: 'Profil mis à jour !' });
        } catch {
            setProfileMessage({ type: 'error', text: 'Erreur lors de la sauvegarde.' });
        } finally {
            setProfileSaving(false);
            setTimeout(() => setProfileMessage(null), 3000);
        }
    };

    const handleSaveWorkspace = async () => {
        if (!profile?.team_id) return;
        setWorkspaceSaving(true);
        setWorkspaceMessage(null);
        try {
            const { error } = await supabase
                .from('teams')
                .update({ name: teamName.trim() })
                .eq('id', profile.team_id);
            if (error) throw error;
            refetchTeam();
            setWorkspaceMessage({ type: 'success', text: 'Workspace mis à jour !' });
        } catch {
            setWorkspaceMessage({ type: 'error', text: 'Erreur lors de la sauvegarde.' });
        } finally {
            setWorkspaceSaving(false);
            setTimeout(() => setWorkspaceMessage(null), 3000);
        }
    };

    // Handle OAuth callback redirects
    useEffect(() => {
        const slackStatus = searchParams.get('slack');
        if (slackStatus === 'connected') {
            setSlackMessage({ type: 'success', text: 'Slack connecté avec succès !' });
            setActiveTab('integrations');
            refetchIntegrations();
            searchParams.delete('slack');
            setSearchParams(searchParams, { replace: true });
        } else if (slackStatus === 'error') {
            const reason = searchParams.get('reason') || 'unknown';
            setSlackMessage({ type: 'error', text: `Erreur de connexion Slack : ${reason}` });
            setActiveTab('integrations');
            searchParams.delete('slack');
            searchParams.delete('reason');
            setSearchParams(searchParams, { replace: true });
        }

        const gcalStatus = searchParams.get('gcal');
        if (gcalStatus === 'connected') {
            setGcalConnected(true);
            setGcalMessage({ type: 'success', text: 'Google Calendar connecté avec succès !' });
            setActiveTab('integrations');
            searchParams.delete('gcal');
            setSearchParams(searchParams, { replace: true });
        } else if (gcalStatus === 'error') {
            const reason = searchParams.get('reason') || 'unknown';
            setGcalMessage({ type: 'error', text: `Erreur de connexion Google Calendar : ${reason}` });
            setActiveTab('integrations');
            searchParams.delete('gcal');
            searchParams.delete('reason');
            setSearchParams(searchParams, { replace: true });
        }

        const notionStatus = searchParams.get('notion');
        if (notionStatus === 'connected') {
            setNotionMessage({ type: 'success', text: 'Notion connecté avec succès !' });
            setActiveTab('integrations');
            refetchIntegrations();
            searchParams.delete('notion');
            setSearchParams(searchParams, { replace: true });
        } else if (notionStatus === 'error') {
            const reason = searchParams.get('reason') || 'unknown';
            setNotionMessage({ type: 'error', text: `Erreur de connexion Notion : ${reason}` });
            setActiveTab('integrations');
            searchParams.delete('notion');
            searchParams.delete('reason');
            setSearchParams(searchParams, { replace: true });
        }
    }, [searchParams]);

    const handleConnectSlack = async () => {
        setSlackConnecting(true);
        setSlackMessage(null);
        try {
            await connectSlack();
        } catch {
            setSlackMessage({ type: 'error', text: 'Impossible de démarrer la connexion Slack.' });
            setSlackConnecting(false);
        }
    };

    const handleDisconnectSlack = async () => {
        try {
            await disconnectIntegration('slack');
            setSlackMessage({ type: 'success', text: 'Slack déconnecté.' });
        } catch {
            setSlackMessage({ type: 'error', text: 'Erreur lors de la déconnexion.' });
        }
    };

    const handleConnectNotion = async () => {
        setNotionConnecting(true);
        setNotionMessage(null);
        try {
            await connectNotion();
        } catch {
            setNotionMessage({ type: 'error', text: 'Impossible de démarrer la connexion Notion.' });
            setNotionConnecting(false);
        }
    };

    const handleDisconnectNotion = async () => {
        try {
            await disconnectIntegration('notion');
            setNotionMessage({ type: 'success', text: 'Notion déconnecté.' });
        } catch {
            setNotionMessage({ type: 'error', text: 'Erreur lors de la déconnexion.' });
        }
    };

    // Google Calendar: check connection status
    useEffect(() => {
        hasGoogleCalendarConnected().then(setGcalConnected);
    }, []);

    const [gcalConnecting, setGcalConnecting] = useState(false);

    const handleConnectGoogleCalendar = async () => {
        if (!profile?.id) return;
        setGcalConnecting(true);
        setGcalMessage(null);
        try {
            const { data, error } = await supabase.functions.invoke('google-calendar-oauth', {
                body: { user_id: profile.id },
            });
            if (error) throw error;
            if (data?.url) {
                window.location.href = data.url;
            }
        } catch {
            setGcalMessage({ type: 'error', text: 'Impossible de se connecter à Google Calendar.' });
            setGcalConnecting(false);
        }
    };

    const handleDisconnectGoogleCalendar = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                await supabase.from('user_google_tokens').delete().eq('user_id', user.id);
            }
            setGcalConnected(false);
            setGcalMessage({ type: 'success', text: 'Google Calendar déconnecté.' });
        } catch {
            setGcalMessage({ type: 'error', text: 'Erreur lors de la déconnexion.' });
        }
    };

    if (loading || !profile) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mx-auto mb-4" />
                    <p className="text-sm text-secondary">Chargement des paramètres...</p>
                </div>
            </div>
        );
    }

    const roleLabels = {
        owner: { label: 'Propriétaire', color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400' },
        admin: { label: 'Admin', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
        member: { label: 'Membre', color: 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400' },
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'connected':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-3 h-3" />
                        Connecté
                    </span>
                );
            case 'available':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
                        <Plug className="w-3 h-3" />
                        Disponible
                    </span>
                );
            case 'coming_soon':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
                        <Clock className="w-3 h-3" />
                        Bientôt
                    </span>
                );
            default:
                return null;
        }
    };

    return (
        <div>
            {/* Header */}
            <h1 className="text-lg sm:text-xl font-semibold text-primary mb-4 sm:mb-6">Paramètres</h1>

            {/* Tab Navigation - scrollable on mobile */}
            <div className="flex items-center gap-1 mb-4 sm:mb-6 bg-zinc-100 dark:bg-card/50 rounded-lg p-1 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:w-fit">
                {[
                    { key: 'profile', label: 'Profil' },
                    { key: 'workspace', label: 'Workspace' },
                    { key: 'permissions', label: 'Permissions' },
                    { key: 'integrations', label: 'Intégrations', icon: <Plug className="w-3.5 h-3.5" /> },
                ].map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key as typeof activeTab)}
                        className={`px-3 sm:px-4 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap flex-shrink-0 inline-flex items-center gap-1.5 ${
                            activeTab === tab.key
                                ? 'bg-white dark:bg-white/10 text-primary shadow-sm'
                                : 'text-tertiary hover:text-secondary'
                        }`}
                    >
                        {'icon' in tab && tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>

            {activeTab === 'profile' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    {/* Profile Section */}
                    <section className="bg-card border border-zinc-200 dark:border-white/5 rounded-lg p-4 sm:p-5">
                        <h2 className="text-sm font-medium text-primary mb-4">Profil</h2>
                        
                        <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-5">
                            <Avatar
                                firstName={profile.first_name || ''}
                                lastName={profile.last_name || ''}
                                color={profile.avatar_color || undefined}
                                size="lg"
                            />
                            <div>
                                <p className="text-sm font-medium text-primary">
                                    {profile.first_name} {profile.last_name}
                                </p>
                                <p className="text-xs text-tertiary">{profile.email}</p>
                                <span className={`inline-block mt-1 px-2 py-0.5 text-[10px] font-medium rounded ${roleLabels[profile.role as 'owner' | 'admin' | 'member'].color}`}>
                                    {roleLabels[profile.role as 'owner' | 'admin' | 'member'].label}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-tertiary mb-1">
                                        Prénom
                                    </label>
                                    <input
                                        type="text"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        className="w-full px-3 py-2.5 sm:py-2 bg-background border border-zinc-200 dark:border-white/5 rounded-lg text-sm text-primary focus:outline-none focus:border-emerald-500/50 transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-tertiary mb-1">
                                        Nom
                                    </label>
                                    <input
                                        type="text"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        className="w-full px-3 py-2.5 sm:py-2 bg-background border border-zinc-200 dark:border-white/5 rounded-lg text-sm text-primary focus:outline-none focus:border-emerald-500/50 transition-colors"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-tertiary mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={profile.email || ''}
                                    readOnly
                                    className="w-full px-3 py-2.5 sm:py-2 bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5 rounded-lg text-sm text-tertiary cursor-not-allowed"
                                />
                            </div>
                        </div>

                        {profileMessage && (
                            <p className={`mt-3 text-xs font-medium ${profileMessage.type === 'success' ? 'text-emerald-500' : 'text-red-500'}`}>
                                {profileMessage.text}
                            </p>
                        )}

                        <button
                            onClick={handleSaveProfile}
                            disabled={profileSaving}
                            className="mt-4 w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 sm:py-1.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                            {profileSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                            Sauvegarder
                        </button>
                    </section>

                    {/* Notifications Section */}
                    <section className="bg-card border border-zinc-200 dark:border-white/5 rounded-lg p-4 sm:p-5">
                        <h2 className="text-sm font-medium text-primary mb-4">Notifications</h2>
                        
                        <div className="space-y-2 sm:space-y-3">
                            <label className="flex items-start sm:items-center justify-between gap-3 py-2 border-b border-zinc-200 dark:border-white/5">
                                <div className="flex-1">
                                    <p className="text-sm text-primary">Nouvelle décision</p>
                                    <p className="text-xs text-tertiary">Recevoir un email pour chaque nouvelle décision</p>
                                </div>
                                <input type="checkbox" defaultChecked className="w-5 h-5 sm:w-4 sm:h-4 rounded border-zinc-300 dark:border-white/20 bg-background text-emerald-500 focus:ring-emerald-500/20 flex-shrink-0" />
                            </label>
                            <label className="flex items-start sm:items-center justify-between gap-3 py-2 border-b border-zinc-200 dark:border-white/5">
                                <div className="flex-1">
                                    <p className="text-sm text-primary">Rappel de vote</p>
                                    <p className="text-xs text-tertiary">Rappel 24h avant la fin d'une décision</p>
                                </div>
                                <input type="checkbox" defaultChecked className="w-5 h-5 sm:w-4 sm:h-4 rounded border-zinc-300 dark:border-white/20 bg-background text-emerald-500 focus:ring-emerald-500/20 flex-shrink-0" />
                            </label>
                            <label className="flex items-start sm:items-center justify-between gap-3 py-2 border-b border-zinc-200 dark:border-white/5">
                                <div className="flex-1">
                                    <p className="text-sm text-primary">Mentions</p>
                                    <p className="text-xs text-tertiary">Notification quand quelqu'un vous mentionne</p>
                                </div>
                                <input type="checkbox" defaultChecked className="w-5 h-5 sm:w-4 sm:h-4 rounded border-zinc-300 dark:border-white/20 bg-background text-emerald-500 focus:ring-emerald-500/20 flex-shrink-0" />
                            </label>
                            <label className="flex items-start sm:items-center justify-between gap-3 py-2">
                                <div className="flex-1">
                                    <p className="text-sm text-primary">Résumé hebdomadaire</p>
                                    <p className="text-xs text-tertiary">Recevoir un résumé des décisions chaque semaine</p>
                                </div>
                                <input type="checkbox" className="w-5 h-5 sm:w-4 sm:h-4 rounded border-zinc-300 dark:border-white/20 bg-background text-emerald-500 focus:ring-emerald-500/20 flex-shrink-0" />
                            </label>
                        </div>
                    </section>
                </div>
            )}

            {activeTab === 'workspace' && (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {/* Workspace Section */}
                    <section className="bg-card border border-zinc-200 dark:border-white/5 rounded-lg p-5">
                        <h2 className="text-sm font-medium text-primary mb-4">Informations</h2>
                        
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs font-medium text-tertiary mb-1">
                                    Nom de l'équipe
                                </label>
                                <input
                                    type="text"
                                    value={teamName}
                                    onChange={(e) => setTeamName(e.target.value)}
                                    className="w-full px-3 py-2 bg-background border border-zinc-200 dark:border-white/5 rounded-lg text-sm text-primary focus:outline-none focus:border-emerald-500/50 transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-tertiary mb-1">
                                    Slug
                                </label>
                                <div className="flex">
                                    <input
                                        type="text"
                                        value={team?.slug || ''}
                                        readOnly
                                        className="flex-1 px-3 py-2 bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5 rounded-l-lg text-sm text-tertiary cursor-not-allowed"
                                    />
                                    <span className="px-3 py-2 bg-zinc-100 dark:bg-white/5 border border-l-0 border-zinc-200 dark:border-white/5 rounded-r-lg text-sm text-tertiary">
                                        .verdikt.ai
                                    </span>
                                </div>
                            </div>
                        </div>

                        {workspaceMessage && (
                            <p className={`mt-3 text-xs font-medium ${workspaceMessage.type === 'success' ? 'text-emerald-500' : 'text-red-500'}`}>
                                {workspaceMessage.text}
                            </p>
                        )}

                        <button
                            onClick={handleSaveWorkspace}
                            disabled={workspaceSaving}
                            className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                            {workspaceSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                            Sauvegarder
                        </button>
                    </section>

                    {/* Default Decision Settings */}
                    <section className="bg-card border border-zinc-200 dark:border-white/5 rounded-lg p-5">
                        <h2 className="text-sm font-medium text-primary mb-4">Paramètres par défaut</h2>
                        
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs font-medium text-tertiary mb-1">
                                    Durée par défaut des décisions
                                </label>
                                <select className="w-full px-3 py-2 bg-background border border-zinc-200 dark:border-white/5 rounded-lg text-sm text-primary focus:outline-none focus:border-emerald-500/50 transition-colors">
                                    <option>24 heures</option>
                                    <option>48 heures</option>
                                    <option selected>72 heures</option>
                                    <option>1 semaine</option>
                                    <option>2 semaines</option>
                                </select>
                            </div>

                            <label className="flex items-center justify-between py-2">
                                <div>
                                    <p className="text-sm text-primary">Participants par défaut</p>
                                    <p className="text-xs text-tertiary">Tous les membres inclus automatiquement</p>
                                </div>
                                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-zinc-300 dark:border-white/20 bg-background text-emerald-500 focus:ring-emerald-500/20" />
                            </label>

                            <label className="flex items-center justify-between py-2">
                                <div>
                                    <p className="text-sm text-primary">Synthèse IA automatique</p>
                                    <p className="text-xs text-tertiary">Générer une synthèse à la fin de chaque décision</p>
                                </div>
                                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-zinc-300 dark:border-white/20 bg-background text-emerald-500 focus:ring-emerald-500/20" />
                            </label>
                        </div>
                    </section>
                </div>
            )}

            {activeTab === 'permissions' && (
                <div className="space-y-6">
                    {/* Members Roles */}
                    <section className="bg-card border border-zinc-200 dark:border-white/5 rounded-lg p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-sm font-medium text-primary">Rôles des membres</h2>
                            <span className="text-xs text-tertiary">{members.length} membres</span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-zinc-200 dark:border-white/5">
                                        <th className="text-left text-xs font-medium text-tertiary pb-2">Membre</th>
                                        <th className="text-left text-xs font-medium text-tertiary pb-2">Email</th>
                                        <th className="text-left text-xs font-medium text-tertiary pb-2">Rôle</th>
                                        <th className="text-left text-xs font-medium text-tertiary pb-2"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {members.map((user) => (
                                        <tr key={user.id} className="border-b border-zinc-100 dark:border-white/[0.02] last:border-0">
                                            <td className="py-3">
                                                <div className="flex items-center gap-2">
                                                    <Avatar
                                                        firstName={user.first_name}
                                                        lastName={user.last_name}
                                                        color={user.avatar_color || undefined}
                                                        size="sm"
                                                    />
                                                    <span className="text-sm text-primary">
                                                        {user.first_name} {user.last_name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-3 text-sm text-tertiary">{user.email}</td>
                                            <td className="py-3">
                                                <span className={`px-2 py-0.5 text-[10px] font-medium rounded ${roleLabels[user.role as 'owner' | 'admin' | 'member'].color}`}>
                                                    {roleLabels[user.role as 'owner' | 'admin' | 'member'].label}
                                                </span>
                                            </td>
                                            <td className="py-3">
                                                {profile.role === 'owner' && user.id !== profile.id && (
                                                    <select
                                                        defaultValue={user.role}
                                                        className="px-2 py-1 text-xs bg-background border border-zinc-200 dark:border-white/5 rounded text-primary"
                                                    >
                                                        <option value="member">Membre</option>
                                                        <option value="admin">Admin</option>
                                                        <option value="owner">Propriétaire</option>
                                                    </select>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* Permissions Matrix */}
                    <section className="bg-card border border-zinc-200 dark:border-white/5 rounded-lg p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <Shield className="w-4 h-4 text-tertiary" />
                            <h2 className="text-sm font-medium text-primary">Matrice des permissions</h2>
                        </div>

                        <div className="flex items-start gap-2 mb-4 p-3 bg-blue-500/5 border border-blue-500/20 rounded-lg">
                            <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-secondary">
                                Les permissions définissent ce que chaque rôle peut faire dans l'application. 
                                Seul le propriétaire peut modifier les rôles des autres membres.
                            </p>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-zinc-200 dark:border-white/5">
                                        <th className="text-left text-xs font-medium text-tertiary pb-2">Permission</th>
                                        <th className="text-center text-xs font-medium text-tertiary pb-2 px-4">
                                            <span className={`px-2 py-0.5 rounded ${roleLabels.member.color}`}>Membre</span>
                                        </th>
                                        <th className="text-center text-xs font-medium text-tertiary pb-2 px-4">
                                            <span className={`px-2 py-0.5 rounded ${roleLabels.admin.color}`}>Admin</span>
                                        </th>
                                        <th className="text-center text-xs font-medium text-tertiary pb-2 px-4">
                                            <span className={`px-2 py-0.5 rounded ${roleLabels.owner.color}`}>Propriétaire</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {permissions.map((perm) => (
                                        <tr key={perm.id} className="border-b border-zinc-100 dark:border-white/[0.02] last:border-0">
                                            <td className="py-3">
                                                <p className="text-sm text-primary">{perm.label}</p>
                                                <p className="text-[10px] text-tertiary">{perm.description}</p>
                                            </td>
                                            <td className="py-3 text-center">
                                                {perm.roles.includes('member') ? (
                                                    <span className="text-emerald-500">✓</span>
                                                ) : (
                                                    <span className="text-tertiary">—</span>
                                                )}
                                            </td>
                                            <td className="py-3 text-center">
                                                {perm.roles.includes('admin') ? (
                                                    <span className="text-emerald-500">✓</span>
                                                ) : (
                                                    <span className="text-tertiary">—</span>
                                                )}
                                            </td>
                                            <td className="py-3 text-center">
                                                {perm.roles.includes('owner') ? (
                                                    <span className="text-emerald-500">✓</span>
                                                ) : (
                                                    <span className="text-tertiary">—</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>
            )}

            {activeTab === 'integrations' && (
                <div className="space-y-6">
                    {/* Header Info */}
                    <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-emerald-500/5 to-transparent border border-emerald-500/20 rounded-lg">
                        <Plug className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="text-sm font-medium text-primary mb-1">Connectez vos outils préférés</h3>
                            <p className="text-xs text-tertiary">
                                Intégrez Verdikt avec les outils que votre équipe utilise au quotidien pour un workflow fluide et centralisé.
                            </p>
                        </div>
                    </div>

                    {/* Integration message toasts */}
                    {slackMessage && (
                        <div className={`p-3 rounded-lg text-sm font-medium flex items-center gap-2 ${
                            slackMessage.type === 'success' 
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' 
                                : 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
                        }`}>
                            {slackMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <Info className="w-4 h-4" />}
                            {slackMessage.text}
                        </div>
                    )}
                    {notionMessage && (
                        <div className={`p-3 rounded-lg text-sm font-medium flex items-center gap-2 ${
                            notionMessage.type === 'success' 
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' 
                                : 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
                        }`}>
                            {notionMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <Info className="w-4 h-4" />}
                            {notionMessage.text}
                        </div>
                    )}

                    {/* Google Calendar message */}
                    {gcalMessage && (
                        <div className={`p-3 rounded-lg text-sm font-medium flex items-center gap-2 ${
                            gcalMessage.type === 'success' 
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' 
                                : 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
                        }`}>
                            {gcalMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <Info className="w-4 h-4" />}
                            {gcalMessage.text}
                        </div>
                    )}

                    {/* Integrations Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {integrationDefs.map((intDef) => {
                            const liveData = getIntegration(intDef.id);
                            const isGcal = intDef.id === 'google_calendar';
                            const isConnected = isGcal ? gcalConnected : !!liveData;
                            const status = isConnected ? 'connected' : intDef.available ? 'available' : 'coming_soon';

                            return (
                                <div
                                    key={intDef.id}
                                    className={`bg-card border rounded-xl p-5 transition-colors ${
                                        isConnected
                                            ? 'border-emerald-500/30 dark:border-emerald-500/20'
                                            : 'border-zinc-200 dark:border-white/5 hover:border-zinc-300 dark:hover:border-white/10'
                                    }`}
                                >
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2.5 rounded-lg ${intDef.bgColor}`}>
                                                {intDef.icon}
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-medium text-primary">{intDef.name}</h3>
                                                {getStatusBadge(status)}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <p className="text-xs text-tertiary mb-4 leading-relaxed">
                                        {intDef.description}
                                    </p>

                                    {/* Connected info */}
                                    {isConnected && liveData && (
                                        <div className="mb-4 p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-lg space-y-1.5">
                                            {liveData.workspace_name && (
                                                <p className="text-xs text-secondary">
                                                    Workspace : <span className="font-medium text-primary">{liveData.workspace_name}</span>
                                                </p>
                                            )}
                                            {liveData.channel_name && (
                                                <p className="text-xs text-secondary">
                                                    Channel : <span className="font-medium text-primary">#{liveData.channel_name}</span>
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {/* Features */}
                                    <div className="space-y-2 mb-4">
                                        {intDef.features.map((feature, idx) => (
                                            <div key={idx} className="flex items-center gap-2 text-xs text-secondary">
                                                <span className={`w-1 h-1 rounded-full flex-shrink-0 ${isConnected ? 'bg-emerald-500' : 'bg-zinc-400'}`} />
                                                {feature}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Action Button */}
                                    {status === 'connected' ? (
                                        <button
                                            onClick={
                                                intDef.id === 'slack' ? handleDisconnectSlack
                                                : intDef.id === 'notion' ? handleDisconnectNotion
                                                : isGcal ? handleDisconnectGoogleCalendar
                                                : undefined
                                            }
                                            className="w-full px-4 py-2 bg-zinc-100 dark:bg-white/5 text-secondary text-sm font-medium rounded-lg hover:bg-red-500/10 hover:text-red-500 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Unplug className="w-3.5 h-3.5" />
                                            Déconnecter
                                        </button>
                                    ) : status === 'coming_soon' ? (
                                        <button
                                            disabled
                                            className="w-full px-4 py-2 bg-zinc-100 dark:bg-white/5 text-tertiary text-sm font-medium rounded-lg cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            <Clock className="w-3.5 h-3.5" />
                                            Bientôt disponible
                                        </button>
                                    ) : (
                                        <button
                                            onClick={
                                                intDef.id === 'slack' ? handleConnectSlack
                                                : intDef.id === 'notion' ? handleConnectNotion
                                                : isGcal ? handleConnectGoogleCalendar
                                                : undefined
                                            }
                                            disabled={
                                                (slackConnecting && intDef.id === 'slack') ||
                                                (notionConnecting && intDef.id === 'notion') ||
                                                (gcalConnecting && isGcal)
                                            }
                                            className="w-full px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            {(slackConnecting && intDef.id === 'slack') || (notionConnecting && intDef.id === 'notion') || (gcalConnecting && isGcal) ? (
                                                <>
                                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                    Connexion...
                                                </>
                                            ) : (
                                                <>
                                                    <Plug className="w-3.5 h-3.5" />
                                                    Connecter
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Request Integration */}
                    <SuggestIntegrationCard />
                </div>
            )}

            {/* Déconnexion */}
            <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-white/5">
                <button
                    onClick={async () => {
                        await signOut();
                        navigate('/');
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 text-sm font-medium rounded-lg transition-colors border border-red-500/20 hover:border-red-500/30"
                >
                    <LogOut className="w-4 h-4" />
                    Se déconnecter
                </button>
            </div>
        </div>
    );
};
