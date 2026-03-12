import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useOnboarding, OnboardingProvider } from '../../context/OnboardingContext';
import { StepProfile } from './steps/StepProfile';
import { StepWorkspace } from './steps/StepWorkspace';
import { StepPoles } from './steps/StepPoles';
import { StepInvite } from './steps/StepInvite';
import { StepIntegrations } from './steps/StepIntegrations';
import { StepFirstDecision } from './steps/StepFirstDecision';
import { ArrowLeft, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { Logo } from '../../components/Logo';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks';

const stepTitles = [
    { title: 'Votre profil', subtitle: 'Parlez-nous de vous' },
    { title: 'Votre équipe', subtitle: 'Créez votre espace' },
    { title: 'Vos pôles', subtitle: 'Organisez votre équipe' },
    { title: 'Invitations', subtitle: 'Invitez vos coéquipiers' },
    { title: 'Intégrations', subtitle: 'Connectez vos outils' },
    { title: 'Première décision', subtitle: 'Lancez-vous !' },
];

const OnboardingContent = () => {
    const { data, currentStep, totalSteps, nextStep, prevStep, canGoNext } = useOnboarding();
    const { refreshProfile } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const generateSlug = (name: string) => {
        return name.toLowerCase()
            .replace(/[àáâãäå]/g, 'a')
            .replace(/[èéêë]/g, 'e')
            .replace(/[ìíîï]/g, 'i')
            .replace(/[òóôõö]/g, 'o')
            .replace(/[ùúûü]/g, 'u')
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
    };

    const handleNext = async () => {
        if (currentStep === totalSteps) {
            setIsLoading(true);
            setError(null);

            try {
                // 1. Get current user
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) throw new Error('User not authenticated');

                // 2. Create team
                const slug = generateSlug(data.teamName);
                const { data: team, error: teamError } = await supabase
                    .from('teams')
                    .insert({
                        name: data.teamName,
                        slug: slug,
                    })
                    .select()
                    .single();

                if (teamError) throw teamError;
                if (!team) throw new Error('Failed to create team');

                // 3. Upsert user profile WITH team_id FIRST
                // (so RLS get_user_team_id() works for subsequent inserts)
                const { error: userError } = await supabase
                    .from('users')
                    .upsert({
                        id: user.id,
                        email: user.email!,
                        team_id: team.id,
                        first_name: data.firstName,
                        last_name: data.lastName,
                        role: 'owner',
                    }, { onConflict: 'id' });

                if (userError) throw userError;

                // 4. Now create poles (RLS can verify team_id)
                if (data.poles.length > 0) {
                    const polesData = data.poles.map(pole => ({
                        team_id: team.id,
                        name: pole.name,
                        description: pole.description,
                        color: pole.color,
                    }));

                    const { error: polesError } = await supabase
                        .from('poles')
                        .insert(polesData);

                    if (polesError) {
                        console.warn('Poles creation warning:', polesError);
                    }
                }

                // 5. Send invitations via invite-member Edge Function (fire & forget)
                if (data.inviteEmails.length > 0) {
                    const { data: { session } } = await supabase.auth.getSession();
                    if (session?.access_token) {
                        supabase.functions.invoke('invite-member', {
                            body: { emails: data.inviteEmails, role: 'member' },
                        }).catch(() => {}); // Non-blocking — don't fail onboarding if invites fail
                    }
                }

                // 6. Mark onboarding as completed
                const { error: metadataError } = await supabase.auth.updateUser({
                    data: {
                        onboarding_completed: true,
                        is_beta_user: true,
                    }
                });

                if (metadataError) throw metadataError;

                // 7. Refresh the cached profile so the app sees updated data
                await refreshProfile();

                // 8. Send welcome email (fire & forget — non-blocking)
                supabase.functions.invoke('send-email', {
                    body: {
                        type: 'welcome',
                        data: {
                            firstName: data.firstName,
                            teamName: data.teamName,
                        },
                    },
                }).catch(() => {});

                // 9. Navigate to app
                navigate('/app');
            } catch (err: any) {
                console.error('Onboarding error:', err);
                setError(err.message || 'Une erreur est survenue. Veuillez réessayer.');
                setIsLoading(false);
            }
        } else {
            nextStep();
        }
    };

    const handleSkip = () => {
        if (currentStep === 3 || currentStep === 4 || currentStep === 5) {
            nextStep();
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <StepProfile />;
            case 2:
                return <StepWorkspace />;
            case 3:
                return <StepPoles />;
            case 4:
                return <StepInvite />;
            case 5:
                return <StepIntegrations />;
            case 6:
                return <StepFirstDecision />;
            default:
                return <StepProfile />;
        }
    };

    return (
        <div className="min-h-screen bg-background flex">
            {/* Left side - Progress & Branding */}
            <div className="hidden lg:flex w-80 bg-zinc-900 flex-col p-8 relative overflow-hidden">
                {/* Grid pattern */}
                <div 
                    className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:48px_48px]"
                />
                
                {/* Gradient orb */}
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-64 h-64 bg-emerald-500/20 rounded-full blur-[100px]" />

                <div className="relative z-10 flex flex-col h-full">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 mb-16">
                        <img src="/Logo FN verdikt.png" alt="Verdikt" className="h-11 object-contain" />
                        <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-medium rounded-full flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            Beta
                        </span>
                    </Link>

                    {/* Progress steps */}
                    <div className="flex-1">
                        <div className="space-y-6">
                            {stepTitles.map((step, index) => {
                                const stepNumber = index + 1;
                                const isActive = stepNumber === currentStep;
                                const isCompleted = stepNumber < currentStep;
                                
                                return (
                                    <motion.div
                                        key={index}
                                        initial={false}
                                        animate={{
                                            opacity: isActive || isCompleted ? 1 : 0.4,
                                        }}
                                        className="flex items-start gap-4"
                                    >
                                        <div className={`
                                            w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                                            ${isCompleted ? 'bg-emerald-500 text-white' : ''}
                                            ${isActive ? 'bg-emerald-500/20 text-emerald-400 ring-2 ring-emerald-500' : ''}
                                            ${!isActive && !isCompleted ? 'bg-white/10 text-white/50' : ''}
                                        `}>
                                            {isCompleted ? '✓' : stepNumber}
                                        </div>
                                        <div>
                                            <p className={`font-medium ${isActive ? 'text-white' : 'text-white/60'}`}>
                                                {step.title}
                                            </p>
                                            <p className="text-sm text-white/40">
                                                {step.subtitle}
                                            </p>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Help text */}
                    <div className="text-sm text-white/40">
                        Besoin d'aide ?{' '}
                        <a href="mailto:contact@verdikt.dev" className="text-emerald-400 hover:underline">
                            Contactez-nous
                        </a>
                    </div>
                </div>
            </div>

            {/* Right side - Form */}
            <div className="flex-1 flex flex-col">
                {/* Mobile header */}
                <div className="lg:hidden p-4 border-b border-zinc-200 dark:border-white/5">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Logo size="sm" linkTo="/" />
                            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-500 text-xs font-medium rounded-full flex items-center gap-1">
                                <Sparkles className="w-2.5 h-2.5" />
                                Beta
                            </span>
                        </div>
                        <span className="text-sm text-tertiary">
                            Étape {currentStep}/{totalSteps}
                        </span>
                    </div>
                    {/* Progress bar */}
                    <div className="flex gap-1.5">
                        {Array.from({ length: totalSteps }).map((_, i) => (
                            <div
                                key={i}
                                className={`h-1 flex-1 rounded-full transition-colors ${
                                    i < currentStep ? 'bg-emerald-500' : 'bg-zinc-200 dark:bg-white/10'
                                }`}
                            />
                        ))}
                    </div>
                </div>

                {/* Form content */}
                <div className="flex-1 flex items-center justify-center p-6 sm:p-8">
                    <div className="w-full max-w-lg">
                        {/* Step header */}
                        <motion.div
                            key={`header-${currentStep}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-8"
                        >
                            <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-2">
                                {stepTitles[currentStep - 1].title}
                            </h1>
                            <p className="text-secondary">
                                {stepTitles[currentStep - 1].subtitle}
                            </p>
                        </motion.div>

                        {/* Step content */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentStep}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                {renderStep()}
                            </motion.div>
                        </AnimatePresence>

                        {/* Error message */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl"
                            >
                                <p className="text-sm text-red-600 dark:text-red-400">
                                    {error}
                                </p>
                            </motion.div>
                        )}

                        {/* Navigation buttons */}
                        <div className="flex items-center justify-between mt-10 pt-6 border-t border-zinc-200 dark:border-white/5">
                            <div>
                                {currentStep > 1 && (
                                    <button
                                        onClick={prevStep}
                                        disabled={isLoading}
                                        className="flex items-center gap-2 px-4 py-2 text-secondary hover:text-primary transition-colors disabled:opacity-50"
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        Retour
                                    </button>
                                )}
                            </div>

                            <div className="flex items-center gap-3">
                                {(currentStep === 3 || currentStep === 4 || currentStep === 5) && (
                                    <button
                                        onClick={handleSkip}
                                        disabled={isLoading}
                                        className="px-4 py-2 text-tertiary hover:text-secondary transition-colors disabled:opacity-50"
                                    >
                                        Passer
                                    </button>
                                )}
                                <motion.button
                                    onClick={handleNext}
                                    disabled={!canGoNext || isLoading}
                                    whileHover={{ scale: canGoNext && !isLoading ? 1.02 : 1 }}
                                    whileTap={{ scale: canGoNext && !isLoading ? 0.98 : 1 }}
                                    className={`
                                        flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all
                                        ${canGoNext && !isLoading
                                            ? 'bg-emerald-500 hover:bg-emerald-400 text-white' 
                                            : 'bg-zinc-200 dark:bg-white/10 text-zinc-400 dark:text-white/30 cursor-not-allowed'}
                                    `}
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            {currentStep === totalSteps ? 'Finaliser mon espace' : 'Continuer'}
                                            <ArrowRight className="w-4 h-4" />
                                        </>
                                    )}
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const Onboarding = () => {
    return (
        <OnboardingProvider>
            <OnboardingContent />
        </OnboardingProvider>
    );
};
