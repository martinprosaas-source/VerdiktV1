import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

interface Pole {
    id: string;
    team_id: string;
    name: string;
    description: string | null;
    color: string;
    created_at: string;
}

// Module-level cache
let cachedPoles: Pole[] = [];
let cachedPolesTeamId: string | null = null;

export const usePoles = () => {
    const { profile } = useAuth();
    const [poles, setPoles] = useState<Pole[]>(cachedPoles);
    const [loading, setLoading] = useState(!cachedPoles.length);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!profile?.team_id) {
            setLoading(false);
            return;
        }

        if (cachedPolesTeamId === profile.team_id && cachedPoles.length > 0) {
            setPoles(cachedPoles);
            setLoading(false);
            return;
        }

        fetchPoles();
    }, [profile?.team_id]);

    const fetchPoles = useCallback(async () => {
        if (!profile?.team_id) return;

        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('poles')
                .select('*')
                .eq('team_id', profile.team_id)
                .order('created_at', { ascending: true });

            if (error) throw error;

            cachedPoles = data || [];
            cachedPolesTeamId = profile.team_id;
            setPoles(data || []);
        } catch (err: any) {
            console.error('Error fetching poles:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [profile?.team_id]);

    const createPole = async (pole: Omit<Pole, 'id' | 'created_at' | 'team_id'>) => {
        if (!profile?.team_id) throw new Error('No team ID');

        try {
            const { data, error } = await supabase
                .from('poles')
                .insert({ ...pole, team_id: profile.team_id })
                .select()
                .single();

            if (error) throw error;
            cachedPolesTeamId = null;
            await fetchPoles();
            return data;
        } catch (err: any) {
            console.error('Error creating pole:', err);
            throw err;
        }
    };

    const updatePole = async (poleId: string, updates: Partial<Pole>) => {
        try {
            const { error } = await supabase
                .from('poles')
                .update(updates)
                .eq('id', poleId);

            if (error) throw error;
            cachedPolesTeamId = null;
            await fetchPoles();
        } catch (err: any) {
            console.error('Error updating pole:', err);
            throw err;
        }
    };

    const deletePole = async (poleId: string) => {
        try {
            const { error } = await supabase
                .from('poles')
                .delete()
                .eq('id', poleId);

            if (error) throw error;
            cachedPolesTeamId = null;
            await fetchPoles();
        } catch (err: any) {
            console.error('Error deleting pole:', err);
            throw err;
        }
    };

    return {
        poles,
        loading,
        error,
        createPole,
        updatePole,
        deletePole,
        refetch: () => { cachedPolesTeamId = null; fetchPoles(); },
    };
};
