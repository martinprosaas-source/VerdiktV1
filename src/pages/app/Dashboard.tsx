import { Link } from 'react-router-dom';
import { Plus, Sparkles, Vote, BarChart3, Calendar } from 'lucide-react';
import { StatCard } from '../../components/app/cards/StatCard';
import { DecisionCard } from '../../components/app/cards/DecisionCard';
import { EmptyState } from '../../components/app/feedback/EmptyState';
import { 
    currentUser, 
    getActiveDecisions, 
    getPendingVotesCount,
    getDecisionsThisMonth 
} from '../../data/mockData';

export const Dashboard = () => {
    const activeDecisions = getActiveDecisions();
    const pendingVotes = getPendingVotesCount(currentUser.id);
    const decisionsThisMonth = getDecisionsThisMonth();

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
                <div>
                    <h1 className="text-lg sm:text-xl font-semibold text-primary">
                        Bonjour {currentUser.firstName}
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
                    value={pendingVotes}
                />
                <StatCard
                    icon={BarChart3}
                    label="Décisions actives"
                    value={activeDecisions.length}
                />
                <StatCard
                    icon={Calendar}
                    label="Décisions ce mois"
                    value={decisionsThisMonth}
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

                {activeDecisions.length > 0 ? (
                    <div className="space-y-2">
                        {activeDecisions.map((decision) => (
                            <DecisionCard key={decision.id} decision={decision} />
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
