import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
    children: React.ReactNode;
    requireAuth?: boolean;
}

export const AuthGuard = ({ 
    children, 
    requireAuth = false,
}: AuthGuardProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!session && requireAuth) {
                navigate('/');
            }
        });

        return () => subscription.unsubscribe();
    }, [location.pathname]);

    const checkAuth = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();

            // If auth is required but user is not logged in
            if (requireAuth && !user) {
                navigate('/');
                return;
            }

            // If user is logged in, check onboarding status
            if (user) {
                const onboardingCompleted = user.user_metadata?.onboarding_completed;

                // User on landing page → redirect to onboarding or app
                if (location.pathname === '/') {
                    if (!onboardingCompleted) {
                        navigate('/onboarding');
                    } else {
                        navigate('/app');
                    }
                    return;
                }

                // User trying to access onboarding but already completed
                if (location.pathname === '/onboarding' && onboardingCompleted) {
                    navigate('/app');
                    return;
                }

                // User trying to access app but onboarding not completed
                if (location.pathname.startsWith('/app') && !onboardingCompleted) {
                    navigate('/onboarding');
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
