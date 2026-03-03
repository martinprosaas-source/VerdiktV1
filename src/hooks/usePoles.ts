import { useEffect, useState } from 'react';
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

export const usePoles = () => {
    const { profile } = useAuth();
    const [poles, setPoles] = useState<Pole[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (profile?.team_id) {
            fetchPoles();
        } else {
            setLoading(false);
        }
    }, [profile?.team_id]);

    const fetchPoles = async () => {
        if (!profile?.team_id) return;

        try {
            const { data, error } = await supabase
                .from('poles')
                .select('*')
                .eq('team_id', profile.team_id)
                .order('created_at', { ascending: true });

            if (error) throw error;
            setPoles(data || []);
        } catch (err: any) {
            console.error('Error fetching poles:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const createPole = async (pole: Omit<Pole, 'id' | 'created_at' | 'team_id'>) => {
        if (!profile?.team_id) throw new Error('No team ID');

        try {
            const { data, error } = await supabase
                .from('poles')
                .insert({
                    ...pole,
                    team_id: profile.team_id,
                })
                .select()
                .single();

            if (error) throw error;
            
            // Refresh poles
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
            
            // Refresh poles
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
            
            // Refresh poles
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
        refetch: fetchPoles,
    };
};
