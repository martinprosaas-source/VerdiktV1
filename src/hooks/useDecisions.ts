import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import { createAuditLog } from '../utils/auditLog';
import { sendSlackNotification } from '../utils/slackNotify';
import { exportToNotion } from '../utils/notionSync';
import { createNotifications } from '../utils/createNotification';
import { addToGoogleCalendar, hasGoogleCalendarConnected } from '../utils/googleCalendarSync';

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
    participant_ids: string[];
    user_vote_option_id: string | null;
}

interface VoteOption {
    id: string;
    decision_id: string;
    label: string;
    position: number;
    votes_count?: number;
}

// Module-level cache — survives navigation (like useTeam)
let cachedDecisions: DecisionWithDetails[] = [];
let cachedTeamId: string | null = null;

export const useDecisions = () => {
    const { profile } = useAuth();
    const [decisions, setDecisions] = useState<DecisionWithDetails[]>(cachedDecisions);
    const [loading, setLoading] = useState(!cachedDecisions.length);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!profile?.team_id) {
            setLoading(false);
            return;
        }

        // Serve cache instantly if same team
        if (cachedTeamId === profile.team_id && cachedDecisions.length > 0) {
            setDecisions(cachedDecisions);
            setLoading(false);
            // Still refetch silently in background to stay fresh
            fetchDecisions(true);
            return;
        }

        // First load for this team
        fetchDecisions(false);
    }, [profile?.team_id]);

    const fetchDecisions = useCallback(async (silent = false) => {
        if (!profile?.team_id) return;

        try {
            if (!silent) setLoading(true);

            // ONE single query: decisions + creator + pole + options + votes count + participants count
            const { data: decisionsData, error: decisionsError } = await supabase
                .from('decisions')
                .select(`
                    *,
                    creator:users!decisions_creator_id_fkey(first_name, last_name, email),
                    pole:poles(name, color),
                    vote_options(id, label, position)
                `)
                .eq('team_id', profile.team_id)
                .order('created_at', { ascending: false });

            if (decisionsError) throw decisionsError;

            if (!decisionsData || decisionsData.length === 0) {
                setDecisions([]);
                setLoading(false);
                return;
            }

            // 2 bulk queries for ALL decisions at once (instead of per-decision)
            const decisionIds = decisionsData.map((d: any) => d.id);

            // Fetch ALL votes in one query
            const { data: allVotes } = await supabase
                .from('votes')
                .select('decision_id, option_id, user_id')
                .in('decision_id', decisionIds);

            // Fetch ALL participants in one query
            const { data: allParticipants } = await supabase
                .from('decision_participants')
                .select('decision_id, user_id')
                .in('decision_id', decisionIds);

            // Build lookup maps for O(1) access
            const votesByOption = new Map<string, number>();
            const votesByDecision = new Map<string, number>();
            const userVoteByDecision = new Map<string, string>(); // decisionId -> optionId (for current user)
            (allVotes || []).forEach((v: any) => {
                votesByOption.set(v.option_id, (votesByOption.get(v.option_id) || 0) + 1);
                votesByDecision.set(v.decision_id, (votesByDecision.get(v.decision_id) || 0) + 1);
                if (v.user_id === profile?.id) {
                    userVoteByDecision.set(v.decision_id, v.option_id);
                }
            });

            const participantsByDecision = new Map<string, number>();
            const participantIdsByDecision = new Map<string, string[]>();
            (allParticipants || []).forEach((p: any) => {
                participantsByDecision.set(p.decision_id, (participantsByDecision.get(p.decision_id) || 0) + 1);
                const ids = participantIdsByDecision.get(p.decision_id) || [];
                ids.push(p.user_id);
                participantIdsByDecision.set(p.decision_id, ids);
            });

            // Assemble everything (no more queries needed)
            const decisionsWithDetails = decisionsData.map((decision: any) => {
                const options = (decision.vote_options || [])
                    .sort((a: any, b: any) => a.position - b.position)
                    .map((opt: any) => ({
                        ...opt,
                        votes_count: votesByOption.get(opt.id) || 0,
                    }));

                return {
                    ...decision,
                    vote_options: undefined,
                    options,
                    votes_count: votesByDecision.get(decision.id) || 0,
                    participants_count: participantsByDecision.get(decision.id) || 0,
                    participant_ids: participantIdsByDecision.get(decision.id) || [],
                    user_vote_option_id: userVoteByDecision.get(decision.id) || null,
                };
            });

            // Update module-level cache
            cachedDecisions = decisionsWithDetails;
            cachedTeamId = profile.team_id;

            setDecisions(decisionsWithDetails);
        } catch (err: any) {
            console.error('Error fetching decisions:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [profile?.team_id]);

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

            const optionsData = decision.options.map((label, index) => ({
                decision_id: newDecision.id,
                label,
                position: index,
            }));

            const participantsData = decision.participant_ids.map(userId => ({
                decision_id: newDecision.id,
                user_id: userId,
            }));

            // Insert options and participants in parallel
            const [optionsResult, participantsResult] = await Promise.all([
                supabase.from('vote_options').insert(optionsData),
                supabase.from('decision_participants').insert(participantsData),
            ]);

            if (optionsResult.error) throw optionsResult.error;
            if (participantsResult.error) throw participantsResult.error;

            // Non-blocking audit log
            createAuditLog({
                userId: profile.id,
                action: 'decision_created',
                details: `A créé la décision "${decision.title}"`,
                decisionId: newDecision.id,
            }).catch(() => {});

            // Non-blocking Slack notification
            sendSlackNotification({
                teamId: profile.team_id,
                type: 'new_decision',
                data: {
                    decision_id: newDecision.id,
                    title: decision.title,
                    context: decision.context,
                    options: decision.options,
                    deadline: decision.deadline.toISOString(),
                    creator_name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim(),
                    pole_name: decision.pole_id ? undefined : undefined,
                },
            }).catch(() => {});

            // Non-blocking in-app notifications for participants
            const creatorName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Quelqu\'un';
            createNotifications({
                recipientIds: decision.participant_ids,
                triggeredByUserId: profile.id,
                type: 'new_decision',
                title: 'Nouvelle décision',
                message: `${creatorName} a créé la décision "${decision.title}"`,
                decisionId: newDecision.id,
            }).catch(() => {});

            // Non-blocking Google Calendar sync (for the creator only if connected)
            hasGoogleCalendarConnected().then(async (connected) => {
                if (!connected) return;
                const { data: participantUsers } = await supabase
                    .from('users')
                    .select('email')
                    .in('id', decision.participant_ids);
                const participantEmails = (participantUsers || []).map((u: any) => u.email).filter(Boolean);
                addToGoogleCalendar({
                    decisionId: newDecision.id,
                    title: decision.title,
                    description: decision.context,
                    deadline: decision.deadline.toISOString(),
                    participants: participantEmails,
                }).catch(() => {});
            }).catch(() => {});

            // Refresh (invalidate cache)
            cachedTeamId = null;
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

            // If decision is being completed, send notifications + Notion export
            if (updates.status === 'completed' && profile?.team_id) {
                const decision = decisions.find(d => d.id === decisionId);
                if (decision) {
                    const totalVotes = decision.options.reduce((sum, o) => sum + (o.votes_count || 0), 0);
                    const winningOption = [...decision.options].sort((a, b) => (b.votes_count || 0) - (a.votes_count || 0))[0];
                    const participationRate = decision.participants_count > 0
                        ? Math.round((totalVotes / decision.participants_count) * 100)
                        : 0;

                    const optionsWithStats = decision.options.map(o => ({
                        label: o.label,
                        votes: o.votes_count || 0,
                        percentage: totalVotes > 0 ? Math.round(((o.votes_count || 0) / totalVotes) * 100) : 0,
                        winner: o.id === winningOption?.id,
                    }));

                    sendSlackNotification({
                        teamId: profile.team_id,
                        type: 'decision_complete',
                        data: {
                            decision_id: decisionId,
                            decision_title: decision.title,
                            results: optionsWithStats,
                            winning_option: winningOption?.label,
                            total_votes: totalVotes,
                            participation_rate: participationRate,
                        },
                    }).catch(() => {});

                    exportToNotion({
                        teamId: profile.team_id,
                        decision: {
                            id: decisionId,
                            title: decision.title,
                            context: decision.context,
                            status: 'completed',
                            deadline: decision.deadline,
                            created_at: decision.created_at,
                            creator_name: `${decision.creator?.first_name || ''} ${decision.creator?.last_name || ''}`.trim(),
                            pole_name: decision.pole?.name,
                            options: optionsWithStats,
                            winning_option: winningOption?.label,
                            total_votes: totalVotes,
                            participation_rate: participationRate,
                        },
                    }).catch(() => {});

                    // In-app notification for decision completed
                    const { data: participants } = await supabase
                        .from('decision_participants')
                        .select('user_id')
                        .eq('decision_id', decisionId);

                    if (participants && profile?.id) {
                        createNotifications({
                            recipientIds: participants.map((p: any) => p.user_id),
                            triggeredByUserId: profile.id,
                            type: 'decision_completed',
                            title: 'Décision finalisée',
                            message: `La décision "${decision.title}" est terminée${winningOption ? ` — ${winningOption.label} l'emporte` : ''}`,
                            decisionId,
                        }).catch(() => {});
                    }
                }
            }
            
            cachedTeamId = null;
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
        refetch: () => { cachedTeamId = null; fetchDecisions(); },
    };
};
