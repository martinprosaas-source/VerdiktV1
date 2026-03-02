import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, User, Building2, Check } from 'lucide-react';
import { Logo } from '../../components/Logo';

export const Register = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        teamName: '',
        agreeTerms: false
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const passwordStrength = () => {
        const { password } = formData;
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        return strength;
    };

    const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-emerald-500'];
    const strengthLabels = ['Faible', 'Moyen', 'Bon', 'Excellent'];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (step === 1) {
            setStep(2);
            return;
        }

        setError('');
        setIsLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        // For demo, show error
        setError('Cette fonctionnalité sera disponible après la beta.');
        setIsLoading(false);
    };

    const updateFormData = (field: string, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="min-h-screen bg-background flex">
            {/* Left side - Visual */}
            <div className="hidden lg:flex flex-1 bg-zinc-900 relative overflow-hidden">
                {/* Grid pattern */}
                <div 
                    className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:48px_48px]"
                />

                {/* Gradient orbs */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px]" />

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center justify-center p-12 text-white">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="max-w-lg"
                    >
                        {/* Logo */}
                        <div className="mb-12">
                            <img src="/Logo FN verdikt.png" alt="Verdikt" className="h-12 object-contain" />
                        </div>

                        <h2 className="text-4xl font-bold mb-6 leading-tight">
                            Transformez la façon dont votre équipe prend des décisions.
                        </h2>
                        <p className="text-white/60 text-lg mb-12">
                            Avec Verdikt, chaque voix compte. Créez des décisions collaboratives, votez en équipe, et obtenez des synthèses IA pour des résultats clairs.
                        </p>

                        {/* Features */}
                        <div className="space-y-4">
                            {[
                                'Décisions collaboratives en temps réel',
                                'Synthèses IA automatiques',
                                'Historique complet et traçabilité',
                                'Intégration Slack & Teams'
                            ].map((feature, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: 0.4 + i * 0.1 }}
                                    className="flex items-center gap-3"
                                >
                                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                        <Check className="w-4 h-4 text-emerald-400" />
                                    </div>
                                    <span className="text-white/80">{feature}</span>
                                </motion.div>
                            ))}
                        </div>

                        {/* Testimonial */}
                        <div className="mt-12 p-6 bg-white/5 rounded-2xl border border-white/10">
                            <p className="text-white/80 italic mb-4">
                                "Verdikt a réduit notre temps de prise de décision de 60%. L'IA nous aide à synthétiser les arguments et à avancer plus vite."
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-medium text-sm">
                                    SL
                                </div>
                                <div>
                                    <p className="text-white font-medium text-sm">Sarah Lemaire</p>
                                    <p className="text-white/50 text-xs">CTO @ TechVenture</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Right side - Form */}
            <div className="flex-1 flex items-center justify-center px-8 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    {/* Mobile Logo */}
                    <div className="lg:hidden mb-8">
                        <Logo size="md" linkTo="/" />
                    </div>

                    {/* Progress indicator */}
                    <div className="flex items-center gap-2 mb-8">
                        <div className={`h-1 flex-1 rounded-full ${step >= 1 ? 'bg-emerald-500' : 'bg-zinc-200 dark:bg-white/10'}`} />
                        <div className={`h-1 flex-1 rounded-full ${step >= 2 ? 'bg-emerald-500' : 'bg-zinc-200 dark:bg-white/10'}`} />
                    </div>

                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-primary mb-2">
                            {step === 1 ? 'Créez votre compte' : 'Configurez votre équipe'}
                        </h1>
                        <p className="text-secondary">
                            {step === 1 
                                ? 'Commencez gratuitement. Aucune carte de crédit requise.'
                                : 'Dernière étape avant de commencer.'}
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {step === 1 ? (
                            <>
                                {/* Name fields */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm font-medium text-primary mb-2">
                                            Prénom
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-tertiary" />
                                            <input
                                                type="text"
                                                value={formData.firstName}
                                                onChange={(e) => updateFormData('firstName', e.target.value)}
                                                placeholder="Marie"
                                                className="w-full pl-11 pr-4 py-3 bg-card border border-zinc-200 dark:border-white/10 rounded-xl text-primary placeholder:text-tertiary focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-primary mb-2">
                                            Nom
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.lastName}
                                            onChange={(e) => updateFormData('lastName', e.target.value)}
                                            placeholder="Laurent"
                                            className="w-full px-4 py-3 bg-card border border-zinc-200 dark:border-white/10 rounded-xl text-primary placeholder:text-tertiary focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-medium text-primary mb-2">
                                        Email professionnel
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-tertiary" />
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => updateFormData('email', e.target.value)}
                                            placeholder="vous@entreprise.com"
                                            className="w-full pl-11 pr-4 py-3 bg-card border border-zinc-200 dark:border-white/10 rounded-xl text-primary placeholder:text-tertiary focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div>
                                    <label className="block text-sm font-medium text-primary mb-2">
                                        Mot de passe
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-tertiary" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={formData.password}
                                            onChange={(e) => updateFormData('password', e.target.value)}
                                            placeholder="8+ caractères"
                                            className="w-full pl-11 pr-12 py-3 bg-card border border-zinc-200 dark:border-white/10 rounded-xl text-primary placeholder:text-tertiary focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                                            required
                                            minLength={8}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-tertiary hover:text-primary transition-colors"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="w-5 h-5" />
                                            ) : (
                                                <Eye className="w-5 h-5" />
                                            )}
                                        </button>
                                    </div>
                                    
                                    {/* Password strength */}
                                    {formData.password && (
                                        <div className="mt-3">
                                            <div className="flex gap-1 mb-1">
                                                {[0, 1, 2, 3].map((i) => (
                                                    <div 
                                                        key={i}
                                                        className={`h-1 flex-1 rounded-full transition-colors ${
                                                            i < passwordStrength() 
                                                                ? strengthColors[passwordStrength() - 1] 
                                                                : 'bg-zinc-200 dark:bg-white/10'
                                                        }`}
                                                    />
                                                ))}
                                            </div>
                                            <p className="text-xs text-tertiary">
                                                Force: {strengthLabels[passwordStrength() - 1] || 'Très faible'}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Team name */}
                                <div>
                                    <label className="block text-sm font-medium text-primary mb-2">
                                        Nom de votre équipe
                                    </label>
                                    <div className="relative">
                                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-tertiary" />
                                        <input
                                            type="text"
                                            value={formData.teamName}
                                            onChange={(e) => updateFormData('teamName', e.target.value)}
                                            placeholder="Acme Inc."
                                            className="w-full pl-11 pr-4 py-3 bg-card border border-zinc-200 dark:border-white/10 rounded-xl text-primary placeholder:text-tertiary focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                                            required
                                        />
                                    </div>
                                    <p className="mt-2 text-xs text-tertiary">
                                        Vous pourrez inviter vos coéquipiers ensuite.
                                    </p>
                                </div>

                                {/* URL preview */}
                                {formData.teamName && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-3 bg-zinc-50 dark:bg-white/5 rounded-lg"
                                    >
                                        <p className="text-xs text-tertiary mb-1">Votre espace sera accessible à :</p>
                                        <p className="text-sm text-primary font-mono">
                                            verdikt.ai/<span className="text-emerald-500">{formData.teamName.toLowerCase().replace(/\s+/g, '-')}</span>
                                        </p>
                                    </motion.div>
                                )}

                                {/* Terms */}
                                <label className="flex items-start gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.agreeTerms}
                                        onChange={(e) => updateFormData('agreeTerms', e.target.checked)}
                                        className="mt-1 w-4 h-4 rounded border-zinc-300 dark:border-white/20 bg-card text-emerald-500 focus:ring-emerald-500/20"
                                        required
                                    />
                                    <span className="text-sm text-secondary">
                                        J'accepte les{' '}
                                        <a href="#" className="text-emerald-600 dark:text-emerald-400 hover:underline">
                                            conditions d'utilisation
                                        </a>{' '}
                                        et la{' '}
                                        <a href="#" className="text-emerald-600 dark:text-emerald-400 hover:underline">
                                            politique de confidentialité
                                        </a>
                                    </span>
                                </label>
                            </>
                        )}

                        {/* Error message */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-600 dark:text-red-400 text-sm"
                            >
                                {error}
                            </motion.div>
                        )}

                        {/* Buttons */}
                        <div className="flex gap-3">
                            {step === 2 && (
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="px-6 py-3 border border-zinc-200 dark:border-white/10 rounded-xl text-primary hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors"
                                >
                                    Retour
                                </button>
                            )}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-500/50 text-white font-medium rounded-xl transition-colors"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        {step === 1 ? 'Continuer' : 'Créer mon compte'}
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    {step === 1 && (
                        <>
                            {/* Divider */}
                            <div className="relative my-8">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-zinc-200 dark:border-white/10" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-background text-tertiary">ou continuer avec</span>
                                </div>
                            </div>

                            {/* Social signup */}
                            <div className="grid grid-cols-2 gap-3">
                                <button className="flex items-center justify-center gap-2 py-3 bg-card border border-zinc-200 dark:border-white/10 rounded-xl text-primary hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors">
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                    </svg>
                                    Google
                                </button>
                                <button className="flex items-center justify-center gap-2 py-3 bg-card border border-zinc-200 dark:border-white/10 rounded-xl text-primary hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                    </svg>
                                    GitHub
                                </button>
                            </div>
                        </>
                    )}

                    {/* Login link */}
                    <p className="mt-8 text-center text-secondary">
                        Déjà un compte ?{' '}
                        <Link to="/login" className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline">
                            Se connecter
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
};
