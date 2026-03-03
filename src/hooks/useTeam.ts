import { useEffect, useState } from 'react';
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

export const useTeam = () => {
    const { profile } = useAuth();
    const [team, setTeam] = useState<Team | null>(null);
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (profile?.team_id) {
            fetchTeam();
            fetchMembers();
        } else {
            setLoading(false);
        }
    }, [profile?.team_id]);

    const fetchTeam = async () => {
        if (!profile?.team_id) return;

        try {
            const { data, error } = await supabase
                .from('teams')
                .select('*')
                .eq('id', profile.team_id)
                .single();

            if (error) throw error;
            setTeam(data);
        } catch (err: any) {
            console.error('Error fetching team:', err);
            setError(err.message);
        }
    };

    const fetchMembers = async () => {
        if (!profile?.team_id) return;

        try {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('team_id', profile.team_id)
                .order('created_at', { ascending: true });

            if (error) throw error;
            setMembers(data || []);
        } catch (err: any) {
            console.error('Error fetching members:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const updateMember = async (memberId: string, updates: Partial<TeamMember>) => {
        try {
            const { error } = await supabase
                .from('users')
                .update(updates)
                .eq('id', memberId);

            if (error) throw error;
            
            // Refresh members
            await fetchMembers();
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
        refetch: () => {
            fetchTeam();
            fetchMembers();
        },
    };
};
