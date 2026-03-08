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

// Module-level cache
let cachedTeam: Team | null = null;
let cachedMembers: TeamMember[] = [];
let cachedTeamId: string | null = null;

export const useTeam = () => {
    const { profile } = useAuth();
    const [team, setTeam] = useState<Team | null>(cachedTeam);
    const [members, setMembers] = useState<TeamMember[]>(cachedMembers);
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

            // Fetch team and members in parallel (2 queries instead of 2 sequential)
            const [teamResult, membersResult] = await Promise.all([
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
            ]);

            if (teamResult.error) throw teamResult.error;
            if (membersResult.error) throw membersResult.error;

            // Update cache
            cachedTeam = teamResult.data;
            cachedMembers = membersResult.data || [];
            cachedTeamId = profile.team_id;

            setTeam(teamResult.data);
            setMembers(membersResult.data || []);
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

    return {
        team,
        members,
        loading,
        error,
        updateMember,
        refetch: () => { cachedTeamId = null; fetchAll(); },
    };
};
