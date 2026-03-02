import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Check, Sparkles, Users, Calendar, Download, Share2, Building2 } from 'lucide-react';
import { StatusBadge, getStatusVariant, getStatusLabel } from '../../components/app/feedback/Badge';
import { Progress } from '../../components/app/feedback/Progress';
import { Avatar } from '../../components/app/feedback/Avatar';
import { DeadlineIndicator } from '../../components/app/feedback/DeadlineIndicator';
import { ArgumentsSection } from '../../components/app/ArgumentsSection';
import { decisions, currentUser, poles } from '../../data/mockData';
import { useState } from 'react';
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
    const decision = decisions.find(d => d.id === id);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [localArguments, setLocalArguments] = useState<Argument[]>(decision?.arguments || []);

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

    const totalVotes = decision.options.reduce((acc, opt) => acc + opt.votes, 0);
    const totalParticipants = decision.participants.length;
    const hasVoted = decision.options.some(opt => opt.voters.includes(currentUser.id));
    const isActive = decision.status === 'active';
    const winningOption = [...decision.options].sort((a, b) => b.votes - a.votes)[0];
    const pole = decision.poleId ? poles.find(p => p.id === decision.poleId) : null;

    const getPoleColorClass = (color: string) => {
        const colors: Record<string, string> = {
            purple: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
            pink: 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20',
            blue: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
            emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
            orange: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
            cyan: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
            yellow: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20',
            red: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
        };
        return colors[color] || colors.blue;
    };

    const handleVote = () => {
        if (selectedOption) {
            navigate('/app/decisions');
        }
    };

    const handleAddArgument = (optionId: string, text: string, mentions: string[]) => {
        const newArgument: Argument = {
            id: `arg-${Date.now()}`,
            userId: currentUser.id,
            user: currentUser,
            optionId,
            text,
            mentions,
            createdAt: new Date(),
        };
        setLocalArguments(prev => [...prev, newArgument]);
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
                            {decision.options.map((option) => {
                                const percentage = totalVotes > 0 
                                    ? Math.round((option.votes / totalVotes) * 100) 
                                    : 0;
                                const isWinner = !isActive && option.id === winningOption?.id;
                                const isSelected = selectedOption === option.id;
                                const canVote = isActive && !hasVoted;

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

                        {isActive && !hasVoted && (
                            <button
                                onClick={handleVote}
                                disabled={!selectedOption}
                                className={`mt-4 w-full py-2.5 font-medium rounded-lg transition-colors ${
                                    selectedOption
                                        ? 'bg-emerald-500 hover:bg-emerald-400 text-white'
                                        : 'bg-zinc-100 dark:bg-white/5 text-tertiary cursor-not-allowed'
                                }`}
                            >
                                Confirmer mon vote
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
                                        {decision.creator.firstName} {decision.creator.lastName}
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
                                        {formatDate(decision.deadline)}
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
                            {decision.participants.map((user) => {
                                const voted = decision.options.some(opt => opt.voters.includes(user.id));
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
