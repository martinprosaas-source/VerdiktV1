import { Link } from 'react-router-dom';
import { Plus, Sparkles, Vote, BarChart3, Calendar } from 'lucide-react';
import { StatCard } from '../../components/app/cards/StatCard';
import { DecisionCard } from '../../components/app/cards/DecisionCard';
import { EmptyState } from '../../components/app/feedback/EmptyState';
import { DashboardSkeleton } from '../../components/app/feedback/Skeleton';
import { useAuth, useDecisions } from '../../hooks';
import { adaptDecisionForComponents } from '../../utils/decisionAdapter';
import { useMemo } from 'react';

export const Dashboard = () => {
    const { profile } = useAuth();
    const { decisions, loading } = useDecisions();

    // Calculate stats from real data
    const stats = useMemo(() => {
        const now = new Date();
        const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        
        const activeDecisions = decisions.filter(d => d && d.status === 'active');
        
        // Count decisions created this month
        const decisionsThisMonth = decisions.filter(d => {
            if (!d || !d.created_at) return false;
            try {
                const createdAt = new Date(d.created_at);
                return createdAt >= thisMonth && createdAt <= now;
            } catch {
                return false;
            }
        }).length;

        // Decisions where current user is a participant and hasn't voted yet
        const pendingVotes = activeDecisions.filter(d => {
            if (!d.participant_ids || !profile?.id) return false;
            const isParticipant = d.participant_ids.includes(profile.id);
            if (!isParticipant) return false;
            // If votes_count is 0 or undefined, assume user hasn't voted
            // More precise check: look at the user's own vote_option_id if available
            const hasVoted = d.user_vote_option_id != null;
            return !hasVoted;
        }).length;

        return {
            activeDecisions,
            pendingVotes,
            decisionsThisMonth,
        };
    }, [decisions]);

    if (loading) return <DashboardSkeleton />;

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
                <div>
                    <h1 className="text-lg sm:text-xl font-semibold text-primary">
                        Bonjour {profile?.first_name || 'Utilisateur'}
                    </h1>
                    <p className="text-sm text-secondary">
                        Voici un aperçu de vos décisions
                    </p>
                </div>
                <Link 
                    to="/app/decisions/new"
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 sm:py-1.5 bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-medium rounded-lg transition-colors w-full sm:w-auto"
                >
                    <Plus className="w-3.5 h-3.5" />
                    Nouvelle décision
                </Link>
            </div>

            {/* Stats Grid - 1 col mobile, 3 cols desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
                <StatCard
                    icon={Vote}
                    label="En attente de ton vote"
                    value={stats.pendingVotes}
                />
                <StatCard
                    icon={BarChart3}
                    label="Décisions actives"
                    value={stats.activeDecisions.length}
                />
                <StatCard
                    icon={Calendar}
                    label="Décisions ce mois"
                    value={stats.decisionsThisMonth}
                />
            </div>

            {/* Active Decisions */}
            <section>
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xs font-medium text-tertiary uppercase tracking-wider">
                        Décisions actives
                    </h2>
                    <Link 
                        to="/app/decisions"
                        className="text-xs text-tertiary hover:text-primary transition-colors"
                    >
                        Voir tout →
                    </Link>
                </div>

                {stats.activeDecisions.length > 0 ? (
                    <div className="space-y-2">
                        {stats.activeDecisions.map((decision) => {
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
                        title="Aucune décision en cours"
                        description="C'est le moment idéal pour lancer une nouvelle décision."
                        action={
                            <Link 
                                to="/app/decisions/new"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-medium rounded-lg transition-colors"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                Nouvelle décision
                            </Link>
                        }
                    />
                )}
            </section>
        </div>
    );
};
