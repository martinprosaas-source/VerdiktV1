import { useParams, useNavigate } from 'react-router-dom';
import { DecisionDetailSkeleton } from '../../components/app/feedback/Skeleton';
import { ArrowLeft, Clock, Check, Sparkles, Users, Calendar, Download, Share2, Building2, Loader2, ExternalLink } from 'lucide-react';
import { StatusBadge, getStatusVariant, getStatusLabel } from '../../components/app/feedback/Badge';
import { Progress } from '../../components/app/feedback/Progress';
import { Avatar } from '../../components/app/feedback/Avatar';
import { DeadlineIndicator } from '../../components/app/feedback/DeadlineIndicator';
import { ArgumentsSection } from '../../components/app/ArgumentsSection';
import { useAuth } from '../../hooks';
import { supabase } from '../../lib/supabase';
import { createAuditLog } from '../../utils/auditLog';
import { sendSlackNotification } from '../../utils/slackNotify';
import { exportToNotion } from '../../utils/notionSync';
import { createNotifications } from '../../utils/createNotification';
import { addToGoogleCalendar, hasGoogleCalendarConnected } from '../../utils/googleCalendarSync';
import { useIntegrations } from '../../hooks';
import { NotionLogo, GoogleCalendarLogo } from '../../components/icons/IntegrationLogos';
import { useState, useEffect } from 'react';
import type { Argument } from '../../types';

const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', { 
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
};

export const DecisionDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { profile } = useAuth();
    
    const { getIntegration } = useIntegrations();
    const [decision, setDecision] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isVoting, setIsVoting] = useState(false);
    const [notionExporting, setNotionExporting] = useState(false);
    const [notionExportResult, setNotionExportResult] = useState<{ type: 'success' | 'error'; url?: string } | null>(null);
    const [calendarSyncing, setCalendarSyncing] = useState(false);
    const [calendarResult, setCalendarResult] = useState<{ type: 'success' | 'error' } | null>(null);
    const [gcalConnected, setGcalConnected] = useState(false);
    const [localArguments, setLocalArguments] = useState<Argument[]>([]);
    const [userVote, setUserVote] = useState<string | null>(null);

    const notionConnected = !!getIntegration('notion');

    useEffect(() => {
        hasGoogleCalendarConnected().then(setGcalConnected);
    }, []);

    useEffect(() => {
        if (id) {
            fetchDecisionDetails();
        }
    }, [id]);

    const fetchDecisionDetails = async () => {
        if (!id) return;

        try {
            setLoading(true);
            
            // ONE query: decision + creator + pole + options
            const { data: decisionData, error: decisionError } = await supabase
                .from('decisions')
                .select(`
                    *,
                    creator:users!decisions_creator_id_fkey(id, first_name, last_name, email, avatar_color),
                    pole:poles(name, color),
                    vote_options(id, label, position)
                `)
                .eq('id', id)
                .single();

            if (decisionError || !decisionData) {
                console.error('Decision not found:', decisionError);
                setLoading(false);
                return;
            }

            // 3 parallel queries (instead of sequential)
            const [participantsResult, votesResult, argsResult] = await Promise.all([
                supabase
                    .from('decision_participants')
                    .select('users(id, first_name, last_name, email, avatar_color)')
                    .eq('decision_id', id),
                supabase
                    .from('votes')
                    .select('user_id, option_id')
                    .eq('decision_id', id),
                supabase
                    .from('arguments')
                    .select('*, user:users(first_name, last_name, email, avatar_color)')
                    .eq('decision_id', id)
                    .order('created_at', { ascending: true }),
            ]);

            // Build votes lookup
            const votesMap = new Map();
            const votesByOption = new Map<string, number>();
            (votesResult.data || []).forEach((vote: any) => {
                votesMap.set(vote.user_id, vote.option_id);
                votesByOption.set(vote.option_id, (votesByOption.get(vote.option_id) || 0) + 1);
            });

            // Map options with vote counts
            const options = (decisionData.vote_options || [])
                .sort((a: any, b: any) => a.position - b.position)
                .map((opt: any) => ({
                    ...opt,
                    votes_count: votesByOption.get(opt.id) || 0,
                }));

            // Map participants
            const participants = (participantsResult.data || [])
                .map((p: any) => ({
                    id: p.users?.id,
                    firstName: p.users?.first_name,
                    lastName: p.users?.last_name,
                    email: p.users?.email,
                    avatarColor: p.users?.avatar_color,
                }))
                .filter((p: any) => p.id);

            // Build the decision object
            const fullDecision = {
                ...decisionData,
                vote_options: undefined,
                creator: decisionData.creator ? {
                    id: decisionData.creator.id,
                    firstName: decisionData.creator.first_name,
                    lastName: decisionData.creator.last_name,
                    email: decisionData.creator.email,
                    avatarColor: decisionData.creator.avatar_color,
                } : null,
                pole: decisionData.pole ? {
                    name: decisionData.pole.name,
                    color: decisionData.pole.color,
                } : null,
                options,
                participants,
                votesMap,
                deadline: new Date(decisionData.deadline),
                createdAt: new Date(decisionData.created_at),
            };

            setDecision(fullDecision);
            
            // Check if user has voted
            if (profile?.id) {
                const userVoteOption = votesMap.get(profile.id);
                if (userVoteOption) {
                    setUserVote(userVoteOption);
                    setSelectedOption(userVoteOption);
                }
            }

            // Map arguments
            if (argsResult.data) {
                setLocalArguments(argsResult.data.map((arg: any) => ({
                    id: arg.id,
                    userId: arg.user_id,
                    user: {
                        id: arg.user_id,
                        firstName: arg.user?.first_name || '',
                        lastName: arg.user?.last_name || '',
                        email: arg.user?.email || '',
                        avatarColor: arg.user?.avatar_color || '#10b981',
                        role: 'member' as const,
                        createdAt: new Date(),
                    },
                    optionId: arg.option_id,
                    text: arg.text,
                    mentions: arg.mentions || [],
                    createdAt: new Date(arg.created_at),
                })));
            }
        } catch (error) {
            console.error('Error fetching decision details:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <DecisionDetailSkeleton />;

    if (!decision) {
        return (
            <div className="text-center py-12">
                <p className="text-tertiary">Décision non trouvée</p>
                <button 
                    onClick={() => navigate('/app/decisions')}
                    className="mt-4 text-sm text-emerald-500 hover:text-emerald-400"
                >
                    ← Retour aux décisions
                </button>
            </div>
        );
    }

    const totalVotes = decision.votes_count || 0;
    const totalParticipants = decision.participants_count || 0;
    const hasVoted = !!userVote;
    const isActive = decision.status === 'active';
    const winningOption = [...decision.options].sort((a, b) => (b.votes_count || 0) - (a.votes_count || 0))[0];
    const pole = decision.pole;

    const getPoleColorClass = (hexColor: string) => {
        const colorMap: Record<string, string> = {
            '#a855f7': 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
            '#ec4899': 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20',
            '#3b82f6': 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
            '#10b981': 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
            '#f97316': 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
            '#06b6d4': 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
            '#eab308': 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20',
            '#ef4444': 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
        };
        return colorMap[hexColor] || colorMap['#3b82f6'];
    };

    const handleVote = async () => {
        if (!selectedOption || !profile?.id || !id) return;

        setIsVoting(true);
        try {
            // Check if user already voted
            if (hasVoted) {
                // Delete old vote
                await supabase
                    .from('votes')
                    .delete()
                    .eq('decision_id', id)
                    .eq('user_id', profile.id);
            }

            // Insert new vote
            const { error } = await supabase
                .from('votes')
                .insert({
                    decision_id: id,
                    option_id: selectedOption,
                    user_id: profile.id,
                });

            if (error) throw error;

            // Get the option label for the log
            const selectedOptionData = decision?.options?.find((opt: any) => opt.id === selectedOption);
            const optionLabel = selectedOptionData?.label || 'une option';

            // Log the action (non-blocking)
            try {
                await createAuditLog({
                    userId: profile.id,
                    action: hasVoted ? 'vote_changed' : 'vote_cast',
                    details: hasVoted 
                        ? `A modifié son vote pour "${optionLabel}" sur "${decision?.title}"`
                        : `A voté "${optionLabel}" sur "${decision?.title}"`,
                    decisionId: id,
                });
            } catch (logError) {
                console.warn('Failed to create audit log:', logError);
            }

            // Slack notification (non-blocking)
            if (profile.team_id) {
                sendSlackNotification({
                    teamId: profile.team_id,
                    type: 'new_vote',
                    data: {
                        decision_id: id,
                        decision_title: decision?.title,
                        voter_name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim(),
                        option_label: optionLabel,
                        votes_count: (decision?.votes_count || 0) + (hasVoted ? 0 : 1),
                        total_participants: decision?.participants_count || 0,
                        all_voted: (decision?.votes_count || 0) + (hasVoted ? 0 : 1) >= (decision?.participants_count || 0),
                    },
                }).catch(() => {});
            }

            // In-app notification to decision creator
            if (decision?.creator_id && decision.creator_id !== profile.id) {
                const voterName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Quelqu\'un';
                createNotifications({
                    recipientIds: [decision.creator_id],
                    triggeredByUserId: profile.id,
                    type: 'vote_cast',
                    title: 'Nouveau vote',
                    message: `${voterName} a voté "${optionLabel}" sur "${decision.title}"`,
                    decisionId: id,
                }).catch(() => {});
            }

            // Refresh decision data
            setUserVote(selectedOption);
            await fetchDecisionDetails();
        } catch (error) {
            console.error('Error voting:', error);
        } finally {
            setIsVoting(false);
        }
    };

    const handleAddArgument = async (optionId: string, text: string, mentions: string[]) => {
        if (!profile?.id || !id) return;

        try {
            const { data, error } = await supabase
                .from('arguments')
                .insert({
                    decision_id: id,
                    option_id: optionId,
                    user_id: profile.id,
                    text,
                    mentions: mentions,
                })
                .select(`
                    *,
                    user:users(first_name, last_name, email, avatar_color)
                `)
                .single();

            if (error) throw error;

            if (data) {
                const newArgument: Argument = {
                    id: data.id,
                    userId: data.user_id,
                    user: {
                        id: data.user_id,
                        firstName: data.user.first_name,
                        lastName: data.user.last_name,
                        email: data.user.email,
                        avatarColor: data.user.avatar_color,
                        role: 'member' as const,
                        createdAt: new Date(),
                    },
                    optionId: data.option_id,
                    text: data.text,
                    mentions: data.mentions || [],
                    createdAt: new Date(data.created_at),
                };
                setLocalArguments(prev => [...prev, newArgument]);

                // Get the option label for the log
                const optionData = decision?.options?.find((opt: any) => opt.id === optionId);
                const optionLabel = optionData?.label || 'une option';

                // Log the action (non-blocking)
                try {
                    await createAuditLog({
                        userId: profile.id,
                        action: 'argument_added',
                        details: `A ajouté un argument pour "${optionLabel}" sur "${decision?.title}"`,
                        decisionId: id,
                    });
                } catch (logError) {
                    console.warn('Failed to create audit log:', logError);
                }

                // Notify decision creator about the new argument
                if (decision?.creator_id && decision.creator_id !== profile.id) {
                    const authorName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Quelqu\'un';
                    createNotifications({
                        recipientIds: [decision.creator_id],
                        triggeredByUserId: profile.id,
                        type: 'argument_added',
                        title: 'Nouvel argument',
                        message: `${authorName} a argumenté pour "${optionLabel}" sur "${decision.title}"`,
                        decisionId: id,
                    }).catch(() => {});
                }
            }
        } catch (error) {
            console.error('Error adding argument:', error);
        }
    };

    const exportToPDF = () => {
        // Create a simple text export (in production, use a proper PDF library)
        const content = `
DÉCISION: ${decision.title}
Status: ${decision.status}
Créée par: ${decision.creator.firstName} ${decision.creator.lastName}
Date: ${formatDate(decision.createdAt)}
Deadline: ${formatDate(decision.deadline)}

CONTEXTE:
${decision.context}

OPTIONS ET VOTES:
${decision.options.map((opt: any) => `- ${opt.label}: ${opt.votes} votes (${totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0}%)`).join('\n')}

ARGUMENTS:
${localArguments.map(arg => `- ${arg.user.firstName}: "${arg.text}" (pour "${decision.options.find((o: any) => o.id === arg.optionId)?.label}")`).join('\n')}

${decision.aiSummary ? `
SYNTHÈSE IA:
Résultat: ${decision.aiSummary.result}
Recommandation: ${decision.aiSummary.recommendation}
` : ''}
        `.trim();

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `decision-${decision.id}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleExportToNotion = async () => {
        if (!profile?.team_id || !decision) return;

        setNotionExporting(true);
        setNotionExportResult(null);

        try {
            const totalVotesCount = decision.options.reduce((sum: number, o: any) => sum + (o.votes_count || 0), 0);
            const winOpt = [...decision.options].sort((a: any, b: any) => (b.votes_count || 0) - (a.votes_count || 0))[0];

            const result = await exportToNotion({
                teamId: profile.team_id,
                decision: {
                    id: decision.id,
                    title: decision.title,
                    context: decision.context,
                    status: decision.status,
                    deadline: decision.deadline instanceof Date ? decision.deadline.toISOString() : decision.deadline,
                    created_at: decision.created_at,
                    creator_name: decision.creator
                        ? `${decision.creator.firstName || decision.creator.first_name || ''} ${decision.creator.lastName || decision.creator.last_name || ''}`.trim()
                        : undefined,
                    pole_name: decision.pole?.name,
                    options: decision.options.map((o: any) => ({
                        label: o.label,
                        votes: o.votes_count || 0,
                        percentage: totalVotesCount > 0 ? Math.round(((o.votes_count || 0) / totalVotesCount) * 100) : 0,
                    })),
                    winning_option: winOpt?.label,
                    total_votes: totalVotesCount,
                    participation_rate: totalParticipants > 0
                        ? Math.round((totalVotesCount / totalParticipants) * 100)
                        : 0,
                },
            });

            if (result.success) {
                setNotionExportResult({ type: 'success', url: result.page_url || undefined });
            } else {
                setNotionExportResult({ type: 'error' });
            }
        } catch {
            setNotionExportResult({ type: 'error' });
        } finally {
            setNotionExporting(false);
        }
    };

    const handleAddToCalendar = async () => {
        if (!decision) return;

        setCalendarSyncing(true);
        setCalendarResult(null);

        try {
            const deadlineStr = decision.deadline instanceof Date
                ? decision.deadline.toISOString()
                : decision.deadline;

            const participantEmails = decision.participants
                ?.map((p: any) => p.email)
                .filter(Boolean) || [];

            const result = await addToGoogleCalendar({
                decisionId: decision.id,
                title: decision.title,
                description: decision.context || undefined,
                deadline: deadlineStr,
                participants: participantEmails,
            });

            setCalendarResult({ type: result.success ? 'success' : 'error' });
        } catch {
            setCalendarResult({ type: 'error' });
        } finally {
            setCalendarSyncing(false);
        }
    };

    const copyShareLink = () => {
        navigator.clipboard.writeText(window.location.href);
    };

    return (
        <div>
            {/* Header */}
            <div className="flex items-start sm:items-center gap-3 mb-4 sm:mb-6">
                <button 
                    onClick={() => navigate(-1)}
                    className="p-1.5 text-tertiary hover:text-primary transition-colors rounded flex-shrink-0 mt-0.5 sm:mt-0"
                >
                    <ArrowLeft className="w-4 h-4" />
                </button>
                <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                        <h1 className="text-lg sm:text-xl font-semibold text-primary">
                            {decision.title}
                        </h1>
                        <div className="flex items-center gap-2 flex-wrap">
                            {pole && (
                                <span className={`px-2 py-0.5 text-xs font-medium rounded border ${getPoleColorClass(pole.color)}`}>
                                    {pole.name.replace('Pôle ', '')}
                                </span>
                            )}
                            <StatusBadge variant={getStatusVariant(decision.status)}>
                                {getStatusLabel(decision.status)}
                            </StatusBadge>
                            {isActive && (
                                <DeadlineIndicator deadline={decision.deadline} size="xs" />
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                    {notionConnected && (
                        <button
                            onClick={handleExportToNotion}
                            disabled={notionExporting}
                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${
                                notionExportResult?.type === 'success'
                                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500'
                                    : 'bg-zinc-100 dark:bg-white/5 border-zinc-200 dark:border-white/10 text-primary hover:bg-zinc-200 dark:hover:bg-white/10 hover:border-zinc-300 dark:hover:border-white/20'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            {notionExporting ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : notionExportResult?.type === 'success' ? (
                                <Check className="w-4 h-4" />
                            ) : (
                                <NotionLogo className="w-4 h-4" />
                            )}
                            <span className="hidden sm:inline">
                                {notionExporting ? 'Export...' : notionExportResult?.type === 'success' ? 'Exporté' : 'Notion'}
                            </span>
                        </button>
                    )}
                    {gcalConnected && isActive && (
                        <button
                            onClick={handleAddToCalendar}
                            disabled={calendarSyncing}
                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${
                                calendarResult?.type === 'success'
                                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500'
                                    : calendarResult?.type === 'error'
                                        ? 'bg-red-500/10 border-red-500/30 text-red-500'
                                        : 'bg-zinc-100 dark:bg-white/5 border-zinc-200 dark:border-white/10 text-primary hover:bg-zinc-200 dark:hover:bg-white/10 hover:border-zinc-300 dark:hover:border-white/20'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            {calendarSyncing ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : calendarResult?.type === 'success' ? (
                                <Check className="w-4 h-4" />
                            ) : (
                                <GoogleCalendarLogo className="w-4 h-4" />
                            )}
                            <span className="hidden sm:inline">
                                {calendarSyncing ? 'Ajout...' : calendarResult?.type === 'success' ? 'Ajouté' : 'Calendrier'}
                            </span>
                        </button>
                    )}
                    <button
                        onClick={copyShareLink}
                        className="p-2 text-tertiary hover:text-primary hover:bg-zinc-100 dark:hover:bg-white/5 rounded-lg transition-colors"
                        title="Copier le lien"
                    >
                        <Share2 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={exportToPDF}
                        className="p-2 text-tertiary hover:text-primary hover:bg-zinc-100 dark:hover:bg-white/5 rounded-lg transition-colors"
                        title="Exporter"
                    >
                        <Download className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Notion export feedback */}
            {notionExportResult && (
                <div className={`mb-4 p-3 rounded-lg text-sm font-medium flex items-center gap-2 ${
                    notionExportResult.type === 'success'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                        : 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
                }`}>
                    {notionExportResult.type === 'success' ? (
                        <>
                            <Check className="w-4 h-4" />
                            Exporté vers Notion !
                            {notionExportResult.url && (
                                <a
                                    href={notionExportResult.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="ml-auto inline-flex items-center gap-1 text-emerald-500 hover:text-emerald-400 underline"
                                >
                                    Ouvrir <ExternalLink className="w-3 h-3" />
                                </a>
                            )}
                        </>
                    ) : (
                        <>Erreur lors de l'export Notion</>
                    )}
                </div>
            )}

            {/* On mobile, sidebar content comes first for better UX */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 sm:gap-6">
                {/* Main Column */}
                <div className="xl:col-span-3 space-y-4 sm:space-y-5">
                    {/* Context */}
                    {decision.context && (
                        <section className="bg-card border border-zinc-200 dark:border-white/5 rounded-lg p-4 sm:p-5">
                            <h2 className="text-xs font-medium text-tertiary uppercase tracking-wider mb-2">
                                Contexte
                            </h2>
                            <p className="text-sm text-secondary leading-relaxed whitespace-pre-line">
                                {decision.context}
                            </p>
                        </section>
                    )}

                    {/* Voting / Results */}
                    <section className="bg-card border border-zinc-200 dark:border-white/5 rounded-lg p-4 sm:p-5">
                        <div className="flex items-center justify-between mb-3 sm:mb-4">
                            <h2 className="text-xs font-medium text-tertiary uppercase tracking-wider">
                                {isActive && !hasVoted ? 'Votez' : 'Résultats'}
                            </h2>
                            <span className="text-xs text-tertiary">
                                {totalVotes}/{totalParticipants} votes
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2 sm:gap-3">
                            {decision.options.map((option: any) => {
                                const optionVotes = option.votes_count || 0;
                                const percentage = totalVotes > 0 
                                    ? Math.round((optionVotes / totalVotes) * 100) 
                                    : 0;
                                const isWinner = !isActive && option.id === winningOption?.id;
                                const isSelected = selectedOption === option.id;
                                const canVote = isActive;

                                return (
                                    <button
                                        key={option.id}
                                        onClick={() => canVote && setSelectedOption(option.id)}
                                        disabled={!canVote}
                                        className={`w-full text-left p-4 rounded-lg border transition-all ${
                                            isSelected
                                                ? 'border-emerald-500 bg-emerald-500/10'
                                                : isWinner
                                                    ? 'border-emerald-500/50 bg-emerald-500/5'
                                                    : 'border-zinc-200 dark:border-white/5 hover:border-zinc-300 dark:hover:border-white/10 bg-background'
                                        } ${canVote ? 'cursor-pointer' : 'cursor-default'}`}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                {isSelected && (
                                                    <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
                                                        <Check className="w-2.5 h-2.5 text-white" />
                                                    </div>
                                                )}
                                                {isWinner && !isSelected && (
                                                    <div className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                                        <Check className="w-2.5 h-2.5 text-emerald-500" />
                                                    </div>
                                                )}
                                                <span className={`text-sm font-medium ${isWinner ? 'text-emerald-500' : 'text-primary'}`}>
                                                    {option.label}
                                                </span>
                                            </div>
                                            {(hasVoted || !isActive) && (
                                                <span className="text-xs text-tertiary">
                                                    {percentage}%
                                                </span>
                                            )}
                                        </div>
                                        {(hasVoted || !isActive) && (
                                            <div className="h-1.5 bg-zinc-200 dark:bg-white/5 rounded-full overflow-hidden">
                                                <div 
                                                    className={`h-full rounded-full transition-all ${isWinner ? 'bg-emerald-500' : 'bg-zinc-400 dark:bg-white/20'}`}
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {isActive && (
                            <button
                                onClick={handleVote}
                                disabled={!selectedOption || isVoting}
                                className={`mt-4 w-full py-2.5 font-medium rounded-lg transition-colors flex items-center justify-center gap-2 ${
                                    selectedOption && !isVoting
                                        ? 'bg-emerald-500 hover:bg-emerald-400 text-white'
                                        : 'bg-zinc-100 dark:bg-white/5 text-tertiary cursor-not-allowed'
                                }`}
                            >
                                {isVoting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        {hasVoted ? 'Modification du vote...' : 'Enregistrement...'}
                                    </>
                                ) : (
                                    hasVoted ? 'Modifier mon vote' : 'Confirmer mon vote'
                                )}
                            </button>
                        )}
                    </section>

                    {/* AI Summary */}
                    {decision.aiSummary && (
                        <section className="bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-lg p-5">
                            <div className="flex items-center gap-2 mb-4">
                                <Sparkles className="w-4 h-4 text-emerald-500" />
                                <h2 className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                                    Synthèse IA
                                </h2>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h3 className="text-xs font-medium text-tertiary mb-1">Résultat</h3>
                                    <p className="text-sm text-primary">{decision.aiSummary.result}</p>
                                </div>
                                <div>
                                    <h3 className="text-xs font-medium text-tertiary mb-1">Recommandation</h3>
                                    <p className="text-sm text-secondary leading-relaxed">{decision.aiSummary.recommendation}</p>
                                </div>
                                {decision.aiSummary.concerns && decision.aiSummary.concerns.length > 0 && (
                                    <div className="md:col-span-2">
                                        <h3 className="text-xs font-medium text-tertiary mb-1">Points d'attention</h3>
                                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-1">
                                            {decision.aiSummary.concerns.map((concern: string, i: number) => (
                                                <li key={i} className="text-sm text-secondary flex items-start gap-2">
                                                    <span className="text-emerald-500 mt-1">•</span>
                                                    {concern}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </section>
                    )}

                    {/* Arguments Section */}
                    <ArgumentsSection
                        arguments={localArguments}
                        options={decision.options}
                        onAddArgument={handleAddArgument}
                        canAddArgument={isActive}
                        teamMembers={decision.participants || []}
                        currentUserId={profile?.id}
                    />
                </div>

                {/* Side Column */}
                <div className="space-y-5">
                    {/* Meta Info */}
                    <section className="bg-card border border-zinc-200 dark:border-white/5 rounded-lg p-5">
                        <div className="space-y-4">
                            {pole && (
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-white/5 flex items-center justify-center">
                                        <Building2 className="w-4 h-4 text-tertiary" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-tertiary">Pôle</p>
                                        <p className="text-sm text-primary">
                                            {pole.name.replace('Pôle ', '')}
                                        </p>
                                    </div>
                                </div>
                            )}
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-white/5 flex items-center justify-center">
                                    <Users className="w-4 h-4 text-tertiary" />
                                </div>
                                <div>
                                    <p className="text-xs text-tertiary">Créée par</p>
                                    <p className="text-sm text-primary">
                                        {decision.creator?.firstName || decision.creator?.first_name || 'Inconnu'} {decision.creator?.lastName || decision.creator?.last_name || ''}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-white/5 flex items-center justify-center">
                                    <Calendar className="w-4 h-4 text-tertiary" />
                                </div>
                                <div>
                                    <p className="text-xs text-tertiary">
                                        {isActive ? 'Deadline' : 'Terminée le'}
                                    </p>
                                    <p className="text-sm text-primary">
                                        {formatDate(new Date(decision.deadline))}
                                    </p>
                                </div>
                            </div>
                            {isActive && (
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-white/5 flex items-center justify-center">
                                        <Clock className="w-4 h-4 text-tertiary" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-tertiary">Progression</p>
                                        <Progress value={totalVotes} max={totalParticipants} size="sm" className="mt-1" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Participants */}
                    <section className="bg-card border border-zinc-200 dark:border-white/5 rounded-lg p-5">
                        <h2 className="text-xs font-medium text-tertiary uppercase tracking-wider mb-3">
                            Participants ({totalParticipants})
                        </h2>
                        <div className="space-y-1.5">
                            {decision.participants?.map((user: any) => {
                                const voted = decision.votesMap?.has(user.id);
                                return (
                                    <div key={user.id} className="flex items-center justify-between py-1">
                                        <div className="flex items-center gap-2">
                                            <Avatar
                                                firstName={user.firstName}
                                                lastName={user.lastName}
                                                color={user.avatarColor}
                                                size="xs"
                                            />
                                            <span className="text-sm text-primary">
                                                {user.firstName}
                                            </span>
                                        </div>
                                        {voted && (
                                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};
