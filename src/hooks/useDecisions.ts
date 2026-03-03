import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

interface Decision {
    id: string;
    team_id: string;
    pole_id: string | null;
    creator_id: string;
    title: string;
    context: string | null;
    deadline: string;
    status: 'active' | 'completed' | 'archived';
    created_at: string;
    updated_at: string;
}

interface DecisionWithDetails extends Decision {
    creator: {
        first_name: string;
        last_name: string;
        email: string;
    };
    pole?: {
        name: string;
        color: string;
    };
    options: VoteOption[];
    votes_count: number;
    participants_count: number;
}

interface VoteOption {
    id: string;
    decision_id: string;
    label: string;
    position: number;
    votes_count?: number;
}

export const useDecisions = () => {
    const { profile } = useAuth();
    const [decisions, setDecisions] = useState<DecisionWithDetails[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (profile?.team_id) {
            fetchDecisions();
        } else {
            setLoading(false);
        }
    }, [profile?.team_id]);

    const fetchDecisions = async () => {
        if (!profile?.team_id) return;

        try {
            // Fetch decisions with creator and pole info
            const { data: decisionsData, error: decisionsError } = await supabase
                .from('decisions')
                .select(`
                    *,
                    creator:users!decisions_creator_id_fkey(first_name, last_name, email),
                    pole:poles(name, color)
                `)
                .eq('team_id', profile.team_id)
                .order('created_at', { ascending: false });

            if (decisionsError) throw decisionsError;

            // For each decision, fetch options and counts
            const decisionsWithDetails = await Promise.all(
                (decisionsData || []).map(async (decision: any) => {
                    // Fetch vote options
                    const { data: options } = await supabase
                        .from('vote_options')
                        .select('*')
                        .eq('decision_id', decision.id)
                        .order('position', { ascending: true });

                    // Count votes for each option
                    const optionsWithCounts = await Promise.all(
                        (options || []).map(async (option: any) => {
                            const { count } = await supabase
                                .from('votes')
                                .select('*', { count: 'exact', head: true })
                                .eq('option_id', option.id);

                            return {
                                ...option,
                                votes_count: count || 0,
                            };
                        })
                    );

                    // Count total votes
                    const { count: votesCount } = await supabase
                        .from('votes')
                        .select('*', { count: 'exact', head: true })
                        .eq('decision_id', decision.id);

                    // Count participants
                    const { count: participantsCount } = await supabase
                        .from('decision_participants')
                        .select('*', { count: 'exact', head: true })
                        .eq('decision_id', decision.id);

                    return {
                        ...decision,
                        options: optionsWithCounts,
                        votes_count: votesCount || 0,
                        participants_count: participantsCount || 0,
                    };
                })
            );

            setDecisions(decisionsWithDetails);
        } catch (err: any) {
            console.error('Error fetching decisions:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const createDecision = async (decision: {
        title: string;
        context?: string;
        deadline: Date;
        pole_id?: string;
        options: string[];
        participant_ids: string[];
    }) => {
        if (!profile?.team_id || !profile?.id) throw new Error('No team or user ID');

        try {
            // 1. Create decision
            const { data: newDecision, error: decisionError } = await supabase
                .from('decisions')
                .insert({
                    team_id: profile.team_id,
                    pole_id: decision.pole_id || null,
                    creator_id: profile.id,
                    title: decision.title,
                    context: decision.context || null,
                    deadline: decision.deadline.toISOString(),
                    status: 'active',
                })
                .select()
                .single();

            if (decisionError) throw decisionError;

            // 2. Create vote options
            const optionsData = decision.options.map((label, index) => ({
                decision_id: newDecision.id,
                label,
                position: index,
            }));

            const { error: optionsError } = await supabase
                .from('vote_options')
                .insert(optionsData);

            if (optionsError) throw optionsError;

            // 3. Add participants
            const participantsData = decision.participant_ids.map(userId => ({
                decision_id: newDecision.id,
                user_id: userId,
            }));

            const { error: participantsError } = await supabase
                .from('decision_participants')
                .insert(participantsData);

            if (participantsError) throw participantsError;

            // Refresh decisions
            await fetchDecisions();
            return newDecision;
        } catch (err: any) {
            console.error('Error creating decision:', err);
            throw err;
        }
    };

    const updateDecision = async (decisionId: string, updates: Partial<Decision>) => {
        try {
            const { error } = await supabase
                .from('decisions')
                .update(updates)
                .eq('id', decisionId);

            if (error) throw error;
            
            // Refresh decisions
            await fetchDecisions();
        } catch (err: any) {
            console.error('Error updating decision:', err);
            throw err;
        }
    };

    const getDecisionById = (decisionId: string) => {
        return decisions.find(d => d.id === decisionId);
    };

    return {
        decisions,
        loading,
        error,
        createDecision,
        updateDecision,
        getDecisionById,
        refetch: fetchDecisions,
    };
};
