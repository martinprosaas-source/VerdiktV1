import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Sparkles, Filter, ArrowUpDown, Clock, AlertTriangle, SortAsc, SortDesc } from 'lucide-react';
import { DecisionCard } from '../../components/app/cards/DecisionCard';
import { EmptyState } from '../../components/app/feedback/EmptyState';
import { useDecisions, useTeam } from '../../hooks';
import { adaptDecisionForComponents } from '../../utils/decisionAdapter';

type FilterType = 'all' | 'active' | 'completed';
type SortType = 'date_desc' | 'date_asc' | 'deadline' | 'participation';
type VoteFilterType = 'all' | 'voted' | 'not_voted';

export const DecisionsList = () => {
    const { decisions, loading } = useDecisions();
    const { members } = useTeam();
    const [filter, setFilter] = useState<FilterType>('all');
    const [sortBy, setSortBy] = useState<SortType>('date_desc');
    const [creatorFilter, setCreatorFilter] = useState<string>('all');
    const [voteFilter, setVoteFilter] = useState<VoteFilterType>('all');
    const [urgentOnly, setUrgentOnly] = useState(false);
    const [showFilters, setShowFilters] = useState(false);

    const filteredAndSortedDecisions = useMemo(() => {
        let result = [...decisions];

        // Status filter
        if (filter === 'active') {
            result = result.filter(d => d.status === 'active');
        } else if (filter === 'completed') {
            result = result.filter(d => d.status === 'completed' || d.status === 'archived');
        }

        // Creator filter
        if (creatorFilter !== 'all') {
            result = result.filter(d => d.creator_id === creatorFilter);
        }

        // Vote filter - placeholder for now (would need to check votes table)
        // if (voteFilter === 'voted') {
        //     result = result.filter(d => d.options.some(opt => opt.voters.includes(profile?.id)));
        // } else if (voteFilter === 'not_voted') {
        //     result = result.filter(d => 
        //         d.status === 'active' && 
        //         !d.options.some(opt => opt.voters.includes(profile?.id))
        //     );
        // }

        // Urgent only (deadline < 24h)
        if (urgentOnly) {
            const now = new Date();
            const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
            result = result.filter(d => 
                d.status === 'active' && 
                new Date(d.deadline) <= in24h
            );
        }

        // Sort
        switch (sortBy) {
            case 'date_desc':
                result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
                break;
            case 'date_asc':
                result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
                break;
            case 'deadline':
                result.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
                break;
            case 'participation':
                result.sort((a, b) => {
                    const aRate = a.votes_count / (a.participants_count || 1);
                    const bRate = b.votes_count / (b.participants_count || 1);
                    return bRate - aRate;
                });
                break;
        }

        return result;
    }, [decisions, filter, sortBy, creatorFilter, voteFilter, urgentOnly]);

    const activeCount = decisions.filter(d => d.status === 'active').length;
    const completedCount = decisions.filter(d => d.status === 'completed' || d.status === 'archived').length;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-sm text-secondary">Chargement des décisions...</p>
                </div>
            </div>
        );
    }

    const filters: { key: FilterType; label: string; count: number }[] = [
        { key: 'all', label: 'Toutes', count: decisions.length },
        { key: 'active', label: 'Actives', count: activeCount },
        { key: 'completed', label: 'Terminées', count: completedCount },
    ];

    const hasActiveFilters = creatorFilter !== 'all' || voteFilter !== 'all' || urgentOnly;

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h1 className="text-lg sm:text-xl font-semibold text-primary">Décisions</h1>
                <Link 
                    to="/app/decisions/new"
                    className="inline-flex items-center gap-1.5 px-3 py-2 sm:py-1.5 bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-medium rounded-lg transition-colors"
                >
                    <Plus className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Nouvelle</span>
                </Link>
            </div>

            {/* Filters Row - scrollable on mobile */}
            <div className="flex items-center gap-2 sm:gap-3 mb-4 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:overflow-visible">
                {/* Status Filters */}
                <div className="flex items-center gap-1 bg-zinc-100 dark:bg-card/50 rounded-lg p-1 flex-shrink-0">
                    {filters.map((f) => (
                        <button
                            key={f.key}
                            onClick={() => setFilter(f.key)}
                            className={`px-2.5 sm:px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                                filter === f.key
                                    ? 'bg-white dark:bg-white/10 text-primary shadow-sm'
                                    : 'text-tertiary hover:text-secondary'
                            }`}
                        >
                            {f.label} <span className="text-tertiary ml-1">{f.count}</span>
                        </button>
                    ))}
                </div>

                {/* Advanced Filters Toggle */}
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors flex-shrink-0 ${
                        hasActiveFilters
                            ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : 'border-zinc-200 dark:border-white/10 text-secondary hover:text-primary'
                    }`}
                >
                    <Filter className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Filtres</span>
                    {hasActiveFilters && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    )}
                </button>

                {/* Sort */}
                <div className="relative group flex-shrink-0">
                    <button className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-medium rounded-lg border border-zinc-200 dark:border-white/10 text-secondary hover:text-primary transition-colors">
                        <ArrowUpDown className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Trier</span>
                    </button>
                    <div className="absolute right-0 sm:left-0 top-full mt-1 w-48 bg-card border border-zinc-200 dark:border-white/10 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                        {[
                            { key: 'date_desc', label: 'Plus récentes', icon: SortDesc },
                            { key: 'date_asc', label: 'Plus anciennes', icon: SortAsc },
                            { key: 'deadline', label: 'Deadline proche', icon: Clock },
                            { key: 'participation', label: 'Participation', icon: ArrowUpDown },
                        ].map(({ key, label, icon: Icon }) => (
                            <button
                                key={key}
                                onClick={() => setSortBy(key as SortType)}
                                className={`w-full flex items-center gap-2 px-3 py-2 text-xs transition-colors first:rounded-t-lg last:rounded-b-lg ${
                                    sortBy === key
                                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                        : 'text-secondary hover:bg-zinc-50 dark:hover:bg-white/5'
                                }`}
                            >
                                <Icon className="w-3.5 h-3.5" />
                                {label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Advanced Filters Panel */}
            {showFilters && (
                <div className="mb-4 p-3 sm:p-4 bg-card border border-zinc-200 dark:border-white/5 rounded-lg">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap items-start lg:items-center gap-3 sm:gap-4">
                        {/* Creator Filter */}
                        <div className="w-full sm:w-auto">
                            <label className="block text-[10px] text-tertiary uppercase tracking-wider mb-1">
                                Créée par
                            </label>
                            <select
                                value={creatorFilter}
                                onChange={(e) => setCreatorFilter(e.target.value)}
                                className="w-full sm:w-auto px-3 py-2 sm:py-1.5 text-xs bg-background border border-zinc-200 dark:border-white/5 rounded-lg text-primary"
                            >
                                <option value="all">Tous</option>
                                {members.map(member => (
                                    <option key={member.id} value={member.id}>
                                        {member.first_name} {member.last_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Vote Filter */}
                        <div className="w-full sm:w-auto">
                            <label className="block text-[10px] text-tertiary uppercase tracking-wider mb-1">
                                Mon vote
                            </label>
                            <select
                                value={voteFilter}
                                onChange={(e) => setVoteFilter(e.target.value as VoteFilterType)}
                                className="w-full sm:w-auto px-3 py-2 sm:py-1.5 text-xs bg-background border border-zinc-200 dark:border-white/5 rounded-lg text-primary"
                            >
                                <option value="all">Tous</option>
                                <option value="voted">J'ai voté</option>
                                <option value="not_voted">En attente de vote</option>
                            </select>
                        </div>

                        {/* Urgent Only */}
                        <label className="flex items-center gap-2 cursor-pointer col-span-1 sm:col-span-2 lg:col-span-1">
                            <input
                                type="checkbox"
                                checked={urgentOnly}
                                onChange={(e) => setUrgentOnly(e.target.checked)}
                                className="w-4 h-4 rounded border-zinc-300 dark:border-white/20 bg-background text-emerald-500 focus:ring-emerald-500/20"
                            />
                            <span className="text-xs text-secondary flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3 text-orange-500" />
                                Urgentes seulement
                            </span>
                        </label>

                        {/* Clear Filters */}
                        {hasActiveFilters && (
                            <button
                                onClick={() => {
                                    setCreatorFilter('all');
                                    setVoteFilter('all');
                                    setUrgentOnly(false);
                                }}
                                className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline"
                            >
                                Réinitialiser
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Results count */}
            <div className="mb-4 text-xs text-tertiary">
                {filteredAndSortedDecisions.length} décision{filteredAndSortedDecisions.length !== 1 ? 's' : ''}
            </div>

            {/* Decisions List */}
            {filteredAndSortedDecisions.length > 0 ? (
                <div className="space-y-2">
                    {filteredAndSortedDecisions.map((decision) => {
                        try {
                            return <DecisionCard key={decision.id} decision={adaptDecisionForComponents(decision)} />;
                        } catch (error) {
                            console.error('Error rendering decision:', decision.id, error);
                            return null;
                        }
                    })}
                </div>
            ) : (
                <EmptyState
                    icon={Sparkles}
                    title="Aucune décision"
                    description={hasActiveFilters ? "Aucune décision ne correspond à vos filtres." : "Créez votre première décision pour commencer."}
                    action={
                        hasActiveFilters ? (
                            <button
                                onClick={() => {
                                    setFilter('all');
                                    setCreatorFilter('all');
                                    setVoteFilter('all');
                                    setUrgentOnly(false);
                                }}
                                className="text-sm text-emerald-500 hover:text-emerald-400"
                            >
                                Réinitialiser les filtres
                            </button>
                        ) : (
                            <Link 
                                to="/app/decisions/new"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-medium rounded-lg transition-colors"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                Nouvelle décision
                            </Link>
                        )
                    }
                />
            )}
        </div>
    );
};
