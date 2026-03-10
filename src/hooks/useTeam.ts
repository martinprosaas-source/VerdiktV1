import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

interface Team {
    id: string;
    name: string;
    slug: string;
    created_at: string;
}

interface TeamMember {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    role: 'owner' | 'admin' | 'member';
    avatar_color: string | null;
    pole_id: string | null;
    created_at: string;
}

export interface PendingInvitation {
    id: string;
    email: string;
    role: 'admin' | 'member';
    invited_by: string | null;
    status: 'pending' | 'accepted' | 'expired';
    created_at: string;
    expires_at: string;
}

// Module-level cache
let cachedTeam: Team | null = null;
let cachedMembers: TeamMember[] = [];
let cachedTeamId: string | null = null;

export const useTeam = () => {
    const { profile } = useAuth();
    const [team, setTeam] = useState<Team | null>(cachedTeam);
    const [members, setMembers] = useState<TeamMember[]>(cachedMembers);
    const [pendingInvitations, setPendingInvitations] = useState<PendingInvitation[]>([]);
    const [loading, setLoading] = useState(!cachedTeam);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!profile?.team_id) {
            // Clear stale data from previous user/session
            setTeam(null);
            setMembers([]);
            setLoading(false);
            return;
        }

        // If team_id hasn't changed and we have cached data, skip fetch
        if (cachedTeamId === profile.team_id && cachedTeam && cachedMembers.length > 0) {
            setTeam(cachedTeam);
            setMembers(cachedMembers);
            setLoading(false);
            return;
        }

        fetchAll();
    }, [profile?.team_id]);

    const fetchAll = useCallback(async () => {
        if (!profile?.team_id) return;

        try {
            setLoading(true);

            // Fetch team, members and pending invitations in parallel
            const [teamResult, membersResult, invitationsResult] = await Promise.all([
                supabase
                    .from('teams')
                    .select('*')
                    .eq('id', profile.team_id)
                    .single(),
                supabase
                    .from('users')
                    .select('*')
                    .eq('team_id', profile.team_id)
                    .order('created_at', { ascending: true }),
                supabase
                    .from('invitations')
                    .select('*')
                    .eq('team_id', profile.team_id)
                    .eq('status', 'pending')
                    .order('created_at', { ascending: false }),
            ]);

            if (teamResult.error) throw teamResult.error;
            if (membersResult.error) throw membersResult.error;

            // Update cache
            cachedTeam = teamResult.data;
            cachedMembers = membersResult.data || [];
            cachedTeamId = profile.team_id;

            setTeam(teamResult.data);
            setMembers(membersResult.data || []);
            setPendingInvitations(invitationsResult.data || []);
        } catch (err: any) {
            console.error('Error fetching team:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [profile?.team_id]);

    const updateMember = async (memberId: string, updates: Partial<TeamMember>) => {
        try {
            const { error } = await supabase
                .from('users')
                .update(updates)
                .eq('id', memberId);

            if (error) throw error;
            
            // Invalidate cache and refetch
            cachedTeamId = null;
            await fetchAll();
        } catch (err: any) {
            console.error('Error updating member:', err);
            throw err;
        }
    };

    const cancelInvitation = async (invitationId: string) => {
        await supabase
            .from('invitations')
            .update({ status: 'expired' })
            .eq('id', invitationId);
        setPendingInvitations(prev => prev.filter(i => i.id !== invitationId));
    };

    return {
        team,
        members,
        pendingInvitations,
        loading,
        error,
        updateMember,
        cancelInvitation,
        refetch: () => { cachedTeamId = null; fetchAll(); },
    };
};
