import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Mail, Lock, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';

const GoogleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
);

export const Signup = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!email || !password) {
            setError('Veuillez remplir tous les champs');
            return;
        }

        if (password.length < 8) {
            setError('Le mot de passe doit contenir au moins 8 caractères');
            return;
        }

        setLoading(true);

        try {
            const { data, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        onboarding_completed: false,
                        is_beta_user: true,
                    },
                },
            });

            if (signUpError) throw signUpError;

            if (data.user) {
                await supabase
                    .from('users')
                    .upsert({
                        id: data.user.id,
                        email: data.user.email,
                    }, { onConflict: 'id' });

                navigate('/onboarding');
            }
        } catch (err: any) {
            console.error('Signup error:', err);
            setError(err.message || 'Erreur lors de l\'inscription');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignup = async () => {
        setGoogleLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/onboarding`,
                    scopes: 'https://www.googleapis.com/auth/calendar.events',
                },
            });

            if (error) throw error;
        } catch (err: any) {
            console.error('Google signup error:', err);
            setError(err.message || 'Erreur lors de la connexion Google');
            setGoogleLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <Link to="/" className="flex items-center justify-center gap-3 mb-8">
                    <img src="/Logo FN verdikt.png" alt="Verdikt" className="h-10 object-contain" />
                    <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-medium rounded-full flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Beta
                    </span>
                </Link>

                {/* Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-card border border-zinc-200 dark:border-white/5 rounded-2xl p-8 shadow-xl"
                >
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-primary mb-2">
                            Créer votre compte
                        </h1>
                        <p className="text-sm text-tertiary">
                            Rejoignez la beta de Verdikt
                        </p>
                    </div>

                    {/* Google Button */}
                    <button
                        onClick={handleGoogleSignup}
                        disabled={googleLoading || loading}
                        className="w-full flex items-center justify-center gap-3 py-3 bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl text-primary font-medium hover:bg-zinc-50 dark:hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {googleLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <GoogleIcon />
                        )}
                        Continuer avec Google
                    </button>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-6">
                        <div className="flex-1 h-px bg-zinc-200 dark:bg-white/10" />
                        <span className="text-xs text-tertiary">ou</span>
                        <div className="flex-1 h-px bg-zinc-200 dark:bg-white/10" />
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSignup} className="space-y-4">
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
                                    disabled={loading || googleLoading}
                                    className="w-full pl-11 pr-4 py-3 bg-background border border-zinc-200 dark:border-white/10 rounded-xl text-primary placeholder:text-tertiary focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all disabled:opacity-50"
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
                                    placeholder="Minimum 8 caractères"
                                    disabled={loading || googleLoading}
                                    className="w-full pl-11 pr-12 py-3 bg-background border border-zinc-200 dark:border-white/10 rounded-xl text-primary placeholder:text-tertiary focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all disabled:opacity-50"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-tertiary hover:text-secondary transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {password && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="mt-2"
                                >
                                    <div className={`h-1 rounded-full transition-colors ${
                                        password.length >= 8 ? 'bg-emerald-500' : 'bg-zinc-200 dark:bg-white/10'
                                    }`} />
                                    <p className={`text-xs mt-1 ${
                                        password.length >= 8 ? 'text-emerald-500' : 'text-tertiary'
                                    }`}>
                                        {password.length >= 8 ? '✓ Mot de passe sécurisé' : `${8 - password.length} caractère${8 - password.length > 1 ? 's' : ''} restant${8 - password.length > 1 ? 's' : ''}`}
                                    </p>
                                </motion.div>
                            )}
                        </div>

                        {/* Error */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-600 dark:text-red-400"
                            >
                                {error}
                            </motion.div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading || googleLoading || !email || password.length < 8}
                            className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-200 dark:disabled:bg-white/5 disabled:text-tertiary text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Création du compte...
                                </>
                            ) : (
                                <>
                                    Créer mon compte
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-tertiary">
                            Déjà un compte ?{' '}
                            <Link to="/login" className="text-emerald-500 hover:text-emerald-400 font-medium transition-colors">
                                Se connecter
                            </Link>
                        </p>
                    </div>

                    {/* Beta info */}
                    <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-white/10">
                        <div className="flex items-start gap-3 p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-lg">
                            <Sparkles className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-xs font-medium text-primary mb-1">
                                    Accès Beta réservé
                                </p>
                                <p className="text-xs text-tertiary">
                                    Cette page est réservée aux utilisateurs beta. Si vous n'avez pas d'accès, contactez hello@verdikt.ai
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Back to landing */}
                <div className="text-center mt-6">
                    <Link to="/" className="text-sm text-tertiary hover:text-secondary transition-colors">
                        ← Retour à l'accueil
                    </Link>
                </div>
            </div>
        </div>
    );
};
