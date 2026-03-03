import { Link } from 'react-router-dom';
import { Plus, Sparkles, Vote, BarChart3, Calendar } from 'lucide-react';
import { StatCard } from '../../components/app/cards/StatCard';
import { DecisionCard } from '../../components/app/cards/DecisionCard';
import { EmptyState } from '../../components/app/feedback/EmptyState';
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
        
        const activeDecisions = decisions.filter(d => d.status === 'active');
        
        // Count decisions created this month
        const decisionsThisMonth = decisions.filter(d => {
            const createdAt = new Date(d.created_at);
            return createdAt >= thisMonth && createdAt <= now;
        }).length;

        // For pending votes, we'd need to check which decisions the user hasn't voted on yet
        // For now, showing active decisions count as a placeholder
        const pendingVotes = activeDecisions.length;

        return {
            activeDecisions,
            pendingVotes,
            decisionsThisMonth,
        };
    }, [decisions]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-sm text-secondary">Chargement...</p>
                </div>
            </div>
        );
    }

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
                        {stats.activeDecisions.map((decision) => (
                            <DecisionCard key={decision.id} decision={adaptDecisionForComponents(decision)} />
                        ))}
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
