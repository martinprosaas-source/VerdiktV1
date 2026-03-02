import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, Shield } from 'lucide-react';
import { Logo, LogoIcon } from '../../components/Logo';

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        // For demo, show error
        setError('Identifiants incorrects. Vérifiez vos accès beta.');
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-background flex">
            {/* Left side - Form */}
            <div className="flex-1 flex items-center justify-center px-8 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    {/* Logo */}
                    <div className="mb-8">
                        <Logo size="md" linkTo="/" />
                    </div>

                    {/* Beta badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6">
                        <Shield className="w-3.5 h-3.5 text-amber-500" />
                        <span className="text-xs font-medium text-amber-500">Accès réservé aux beta testers</span>
                    </div>

                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-primary mb-2">
                            Connexion Beta
                        </h1>
                        <p className="text-secondary">
                            Utilisez les identifiants fournis par l'équipe Verdikt.
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-primary mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-tertiary" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
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
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-11 pr-12 py-3 bg-card border border-zinc-200 dark:border-white/10 rounded-xl text-primary placeholder:text-tertiary focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                                    required
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
                        </div>

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

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-500/50 text-white font-medium rounded-xl transition-colors"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    Se connecter
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Help text */}
                    <div className="mt-8 p-4 bg-card/50 border border-zinc-200 dark:border-white/5 rounded-xl">
                        <p className="text-sm text-secondary">
                            <span className="font-medium text-primary">Problème de connexion ?</span>
                            <br />
                            Contactez-nous à{' '}
                            <a href="mailto:support@verdikt.ai" className="text-emerald-600 dark:text-emerald-400 hover:underline">
                                support@verdikt.ai
                            </a>
                        </p>
                    </div>

                    {/* Waitlist link */}
                    <p className="mt-6 text-center text-secondary text-sm">
                        Pas encore d'accès beta ?{' '}
                        <Link to="/#pricing" className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline">
                            Rejoindre la waitlist
                        </Link>
                    </p>
                </motion.div>
            </div>

            {/* Right side - Visual */}
            <div className="hidden lg:flex flex-1 bg-zinc-950 relative overflow-hidden items-center justify-center">
                {/* Grid pattern */}
                <div 
                    className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:48px_48px]"
                    style={{
                        maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 70%)',
                        WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 70%)'
                    }}
                />

                {/* Emerald glows */}
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-emerald-500/[0.08] rounded-full blur-[120px]" />
                <div className="absolute bottom-1/3 right-1/4 w-[300px] h-[300px] bg-emerald-400/[0.05] rounded-full blur-[100px]" />

                {/* Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="relative z-10 text-center px-12"
                >
                    {/* Logo Icon */}
                    <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.3, type: 'spring' }}
                        className="mb-10 flex justify-center"
                    >
                        <LogoIcon size="lg" className="w-20 h-20" />
                    </motion.div>

                    {/* Slogan */}
                    <h2 className="text-4xl xl:text-5xl font-bold leading-[1.1] tracking-tight">
                        <span className="text-white/50">Arrêtez de débattre.</span>
                        <br />
                        <span className="text-white">Commencez à </span>
                        <span className="text-emerald-400">décider</span>
                        <span className="text-white">.</span>
                    </h2>
                </motion.div>
            </div>
        </div>
    );
};
