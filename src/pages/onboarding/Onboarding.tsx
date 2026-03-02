import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useOnboarding, OnboardingProvider } from '../../context/OnboardingContext';
import { StepProfile } from './steps/StepProfile';
import { StepWorkspace } from './steps/StepWorkspace';
import { StepInvite } from './steps/StepInvite';
import { StepIntegrations } from './steps/StepIntegrations';
import { StepFirstDecision } from './steps/StepFirstDecision';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Logo } from '../../components/Logo';

const stepTitles = [
    { title: 'Votre profil', subtitle: 'Parlez-nous de vous' },
    { title: 'Votre équipe', subtitle: 'Créez votre espace' },
    { title: 'Invitations', subtitle: 'Invitez vos coéquipiers' },
    { title: 'Intégrations', subtitle: 'Connectez vos outils' },
    { title: 'Première décision', subtitle: 'Lancez-vous !' },
];

const OnboardingContent = () => {
    const { currentStep, totalSteps, nextStep, prevStep, canGoNext } = useOnboarding();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleNext = async () => {
        if (currentStep === totalSteps) {
            setIsLoading(true);
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            navigate('/app');
        } else {
            nextStep();
        }
    };

    const handleSkip = () => {
        if (currentStep === 3 || currentStep === 4) {
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
                return <StepInvite />;
            case 4:
                return <StepIntegrations />;
            case 5:
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
                    <Link to="/" className="block mb-16">
                        <img src="/Logo FN verdikt.png" alt="Verdikt" className="h-11 object-contain" />
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
                        <a href="mailto:hello@verdikt.ai" className="text-emerald-400 hover:underline">
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
                        <Logo size="sm" linkTo="/" />
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

                        {/* Navigation buttons */}
                        <div className="flex items-center justify-between mt-10 pt-6 border-t border-zinc-200 dark:border-white/5">
                            <div>
                                {currentStep > 1 && (
                                    <button
                                        onClick={prevStep}
                                        className="flex items-center gap-2 px-4 py-2 text-secondary hover:text-primary transition-colors"
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        Retour
                                    </button>
                                )}
                            </div>

                            <div className="flex items-center gap-3">
                                {(currentStep === 3 || currentStep === 4) && (
                                    <button
                                        onClick={handleSkip}
                                        className="px-4 py-2 text-tertiary hover:text-secondary transition-colors"
                                    >
                                        Passer
                                    </button>
                                )}
                                <motion.button
                                    onClick={handleNext}
                                    disabled={!canGoNext || isLoading}
                                    whileHover={{ scale: canGoNext ? 1.02 : 1 }}
                                    whileTap={{ scale: canGoNext ? 0.98 : 1 }}
                                    className={`
                                        flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all
                                        ${canGoNext 
                                            ? 'bg-emerald-500 hover:bg-emerald-400 text-white' 
                                            : 'bg-zinc-200 dark:bg-white/10 text-zinc-400 dark:text-white/30 cursor-not-allowed'}
                                    `}
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            {currentStep === totalSteps ? 'Lancer ma première décision' : 'Continuer'}
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
