import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Check, Sparkles, Users, Calendar, Download, Share2, Building2, Loader2 } from 'lucide-react';
import { StatusBadge, getStatusVariant, getStatusLabel } from '../../components/app/feedback/Badge';
import { Progress } from '../../components/app/feedback/Progress';
import { Avatar } from '../../components/app/feedback/Avatar';
import { DeadlineIndicator } from '../../components/app/feedback/DeadlineIndicator';
import { ArgumentsSection } from '../../components/app/ArgumentsSection';
import { useDecisions, useAuth } from '../../hooks';
import { supabase } from '../../lib/supabase';
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
    const { getDecisionById } = useDecisions();
    const { profile } = useAuth();
    
    const [decision, setDecision] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isVoting, setIsVoting] = useState(false);
    const [localArguments, setLocalArguments] = useState<Argument[]>([]);
    const [userVote, setUserVote] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            fetchDecisionDetails();
        }
    }, [id]);

    const fetchDecisionDetails = async () => {
        if (!id) return;

        try {
            setLoading(true);
            
            // Get decision from hook
            const decisionData = getDecisionById(id);
            
            if (decisionData) {
                // Fetch participants
                const { data: participantsData } = await supabase
                    .from('decision_participants')
                    .select(`
                        users(id, first_name, last_name, email, avatar_color)
                    `)
                    .eq('decision_id', id);

                const participants = participantsData?.map((p: any) => ({
                    id: p.users.id,
                    firstName: p.users.first_name,
                    lastName: p.users.last_name,
                    email: p.users.email,
                    avatarColor: p.users.avatar_color,
                })) || [];

                // Fetch votes to know who voted
                const { data: votesData } = await supabase
                    .from('votes')
                    .select('user_id, option_id')
                    .eq('decision_id', id);

                const votesMap = new Map();
                votesData?.forEach((vote: any) => {
                    votesMap.set(vote.user_id, vote.option_id);
                });

                setDecision({
                    ...decisionData,
                    participants,
                    votesMap,
                });
                
                // Check if user has voted
                if (profile?.id) {
                    const userVoteOption = votesMap.get(profile.id);
                    if (userVoteOption) {
                        setUserVote(userVoteOption);
                        setSelectedOption(userVoteOption);
                    }
                }

                // Fetch arguments
                const { data: argsData } = await supabase
                    .from('arguments')
                    .select(`
                        *,
                        user:users(first_name, last_name, email, avatar_color)
                    `)
                    .eq('decision_id', id)
                    .order('created_at', { ascending: true });

                if (argsData) {
                    setLocalArguments(argsData.map((arg: any) => ({
                        id: arg.id,
                        userId: arg.user_id,
                        user: {
                            id: arg.user_id,
                            firstName: arg.user.first_name,
                            lastName: arg.user.last_name,
                            email: arg.user.email,
                            avatarColor: arg.user.avatar_color,
                        },
                        optionId: arg.option_id,
                        text: arg.text,
                        mentions: arg.mentions || [],
                        createdAt: new Date(arg.created_at),
                    })));
                }
            }
        } catch (error) {
            console.error('Error fetching decision details:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mx-auto mb-4" />
                    <p className="text-sm text-secondary">Chargement de la décision...</p>
                </div>
            </div>
        );
    }

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
                    },
                    optionId: data.option_id,
                    text: data.text,
                    mentions: data.mentions || [],
                    createdAt: new Date(data.created_at),
                };
                setLocalArguments(prev => [...prev, newArgument]);
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
${decision.options.map(opt => `- ${opt.label}: ${opt.votes} votes (${totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0}%)`).join('\n')}

ARGUMENTS:
${localArguments.map(arg => `- ${arg.user.firstName}: "${arg.text}" (pour "${decision.options.find(o => o.id === arg.optionId)?.label}")`).join('\n')}

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

    const copyShareLink = () => {
        navigator.clipboard.writeText(window.location.href);
        // In production, show a toast notification
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
                <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
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
                                            {decision.aiSummary.concerns.map((concern, i) => (
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
                                        {decision.creator?.first_name || 'Unknown'} {decision.creator?.last_name || ''}
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
