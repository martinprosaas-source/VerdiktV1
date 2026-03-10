import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
    children: React.ReactNode;
    requireAuth?: boolean;
}

const AUTH_PAGES = ['/login', '/signup', '/register'];

export const AuthGuard = ({ 
    children, 
    requireAuth = false,
}: AuthGuardProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!session && requireAuth) {
                navigate('/login');
            }
        });

        return () => subscription.unsubscribe();
    }, [location.pathname]);

    const checkAuth = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (requireAuth && !user) {
                navigate('/login');
                return;
            }

            if (user) {
                const onboardingCompleted = user.user_metadata?.onboarding_completed;
                const isInvitedUser = !!user.user_metadata?.invited_team_id;
                const isOnAuthPage = AUTH_PAGES.includes(location.pathname);

                // Determine where an unonboarded user should go
                const pendingDest = isInvitedUser ? '/join' : '/onboarding';

                // Authenticated user on landing or auth pages → redirect
                if (location.pathname === '/' || isOnAuthPage) {
                    navigate(onboardingCompleted ? '/app' : pendingDest);
                    return;
                }

                // Already onboarded → skip onboarding/join
                if ((location.pathname === '/onboarding' || location.pathname === '/join') && onboardingCompleted) {
                    navigate('/app');
                    return;
                }

                // Invited user trying to go through onboarding → redirect to /join
                if (location.pathname === '/onboarding' && isInvitedUser) {
                    navigate('/join');
                    return;
                }

                // App requires completed onboarding
                if (location.pathname.startsWith('/app') && !onboardingCompleted) {
                    navigate(pendingDest);
                    return;
                }
            }
        } catch (error) {
            console.error('Auth check error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                    <p className="text-sm text-secondary">Chargement...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};
