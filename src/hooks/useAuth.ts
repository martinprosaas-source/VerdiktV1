import { useEffect, useState, useRef, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface UserProfile {
    id: string;
    team_id: string | null;
    pole_id: string | null;
    first_name: string;
    last_name: string;
    email: string;
    role: 'owner' | 'admin' | 'member';
    avatar_color: string | null;
    created_at: string;
}

let cachedProfile: UserProfile | null = null;
let cachedUser: User | null = null;
let cachedUserId: string | null = null;

async function storeGoogleTokens(userId: string, accessToken: string, refreshToken: string | null) {
    try {
        const payload: Record<string, any> = {
            user_id: userId,
            access_token: accessToken,
            token_expires_at: new Date(Date.now() + 3600 * 1000).toISOString(),
        };
        if (refreshToken) payload.refresh_token = refreshToken;

        await supabase.from('user_google_tokens').upsert(payload, { onConflict: 'user_id' });
    } catch (e) {
        console.error('Failed to store Google tokens:', e);
    }
}

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(cachedUser);
    const [profile, setProfile] = useState<UserProfile | null>(cachedProfile);
    const [loading, setLoading] = useState(!cachedUser);
    const initialized = useRef(false);

    const fetchProfile = useCallback(async (userId: string, retries = 3): Promise<UserProfile | null> => {
        for (let attempt = 0; attempt < retries; attempt++) {
            try {
                const { data, error } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', userId)
                    .single();

                if (error) {
                    if (attempt < retries - 1) {
                        await new Promise(r => setTimeout(r, 800 * (attempt + 1)));
                        continue;
                    }

                    // Last retry failed — create the row as fallback
                    const { data: { user: authUser } } = await supabase.auth.getUser();
                    if (authUser) {
                        // Support invited users: read team/role from metadata
                        const meta = authUser.user_metadata || {};
                        const invitedTeamId = meta.invited_team_id || null;
                        const invitedRole = meta.invited_role || 'member';

                        const { data: created } = await supabase
                            .from('users')
                            .upsert({
                                id: authUser.id,
                                email: authUser.email,
                                ...(invitedTeamId ? { team_id: invitedTeamId, role: invitedRole } : {}),
                            }, { onConflict: 'id' })
                            .select('*')
                            .single();

                        if (created) {
                            cachedProfile = created;
                            cachedUserId = userId;
                            setProfile(created);
                            return created;
                        }
                    }
                    throw error;
                }

                cachedProfile = data;
                cachedUserId = userId;
                setProfile(data);
                return data;
            } catch (error) {
                if (attempt === retries - 1) {
                    console.error('Error fetching profile after retries:', error);
                }
            }
        }
        return null;
    }, []);

    useEffect(() => {
        if (initialized.current) return;
        initialized.current = true;

        // If cached data is valid and for the same user, use it
        if (cachedUser && cachedProfile && cachedUserId === cachedUser.id) {
            setUser(cachedUser);
            setProfile(cachedProfile);
            setLoading(false);
        } else {
            getUser();
        }

        // ALWAYS set up auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            const newUser = session?.user ?? null;

            // User changed or signed out — clear stale cache
            if (cachedUserId && newUser?.id !== cachedUserId) {
                cachedProfile = null;
                cachedUserId = null;
            }

            cachedUser = newUser;
            setUser(newUser);

            if (newUser) {
                fetchProfile(newUser.id);

                // Capture Google OAuth tokens for Calendar integration
                if (session?.provider_token && newUser.app_metadata?.provider === 'google') {
                    storeGoogleTokens(newUser.id, session.provider_token, session.provider_refresh_token ?? null);
                }
            } else {
                cachedProfile = null;
                cachedUserId = null;
                setProfile(null);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const getUser = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            cachedUser = user;
            setUser(user);
            if (user) {
                await fetchProfile(user.id);
            }
        } catch (error) {
            console.error('Error getting user:', error);
        } finally {
            setLoading(false);
        }
    };

    const refreshProfile = useCallback(async () => {
        const currentUser = cachedUser || user;
        if (!currentUser) return null;

        cachedProfile = null;
        const fresh = await fetchProfile(currentUser.id, 1);
        return fresh;
    }, [user, fetchProfile]);

    const signOut = async () => {
        try {
            cachedUser = null;
            cachedProfile = null;
            cachedUserId = null;
            initialized.current = false;
            setUser(null);
            setProfile(null);
            await supabase.auth.signOut();
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return {
        user,
        profile,
        loading,
        signOut,
        refreshProfile,
        isAuthenticated: !!user,
        isBetaUser: user?.user_metadata?.is_beta_user ?? false,
        onboardingCompleted: user?.user_metadata?.onboarding_completed ?? false,
        isOwner: profile?.role === 'owner',
        canManage: profile?.role === 'owner' || profile?.role === 'admin',
    };
};
