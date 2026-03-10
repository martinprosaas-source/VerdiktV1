import { useState } from 'react';
import { Search, Archive, Loader2 } from 'lucide-react';
import { DecisionCard } from '../../components/app/cards/DecisionCard';
import { EmptyState } from '../../components/app/feedback/EmptyState';
import { useDecisions, useDelayedLoading } from '../../hooks';
import { adaptDecisionForComponents } from '../../utils/decisionAdapter';

export const History = () => {
    const [search, setSearch] = useState('');
    const { decisions, loading } = useDecisions();
    const showSpinner = useDelayedLoading(loading);
    
    const completedDecisions = decisions.filter(d => 
        d.status === 'completed' || d.status === 'archived'
    );

    const filteredDecisions = completedDecisions.filter(decision =>
        decision.title.toLowerCase().includes(search.toLowerCase())
    );

    if (showSpinner) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <h1 className="text-xl font-semibold text-primary mb-6">Historique</h1>

            {/* Search */}
            <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-tertiary" />
                <input
                    type="text"
                    placeholder="Rechercher..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-card border border-zinc-200 dark:border-white/5 rounded-lg text-sm text-primary placeholder:text-tertiary focus:outline-none focus:border-emerald-500/50 transition-colors"
                />
            </div>

            {/* Decisions List */}
            {filteredDecisions.length > 0 ? (
                <div className="space-y-2">
                    {filteredDecisions.map((decision) => (
                        <DecisionCard key={decision.id} decision={adaptDecisionForComponents(decision)} />
                    ))}
                </div>
            ) : (
                <EmptyState
                    icon={Archive}
                    title={search ? 'Aucun résultat' : 'Aucune décision terminée'}
                    description={
                        search 
                            ? 'Essayez avec d\'autres termes de recherche.'
                            : 'Les décisions terminées apparaîtront ici.'
                    }
                />
            )}
        </div>
    );
};
