import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
    },
});

// Helper pour gérer les erreurs Supabase
export const handleSupabaseError = (error: any) => {
    console.error('Supabase error:', error);
    return {
        error: error.message || 'Une erreur est survenue',
        details: error,
    };
};
