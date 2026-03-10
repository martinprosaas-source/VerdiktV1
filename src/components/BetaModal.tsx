import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Loader2, ChevronDown, Mail, MessageCircle, Copy, Check, Gift } from 'lucide-react';
import { Button } from './ui/Button';
import { LogoIcon } from './Logo';
import { supabase } from '../lib/supabase';
import type { SelectedPlan } from '../context/BetaModalContext';

interface BetaModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedPlan?: SelectedPlan;
}

// Confetti component for success animation
const Confetti = () => {
    const colors = ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#fbbf24', '#f472b6'];
    const confettiPieces = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        scale: 0.5 + Math.random() * 0.5,
    }));

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {confettiPieces.map((piece) => (
                <motion.div
                    key={piece.id}
                    className="absolute w-3 h-3 rounded-sm"
                    style={{
                        left: `${piece.x}%`,
                        top: '-10px',
                        backgroundColor: piece.color,
                        rotate: piece.rotation,
                        scale: piece.scale,
                    }}
                    initial={{ y: -20, opacity: 1 }}
                    animate={{
                        y: 500,
                        opacity: 0,
                        rotate: piece.rotation + 720,
                        x: (Math.random() - 0.5) * 200,
                    }}
                    transition={{
                        duration: 2 + Math.random(),
                        delay: piece.delay,
                        ease: 'easeOut',
                    }}
                />
            ))}
        </div>
    );
};

export const BetaModal = ({ isOpen, onClose, selectedPlan }: BetaModalProps) => {
    const [firstName, setFirstName] = useState('');
    const [email, setEmail] = useState('');
    const [company, setCompany] = useState('');
    const [website, setWebsite] = useState('');
    const [teamSize, setTeamSize] = useState('');
    const [plan, setPlan] = useState<string>('');
    const [contactPreference, setContactPreference] = useState<'email' | 'whatsapp'>('email');
    const [phone, setPhone] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    // Generate a simple referral code based on email
    const referralCode = email ? email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '') : 'verdikt';
    const referralLink = `https://verdikt.ai/?ref=${referralCode}`;

    const copyReferralLink = async () => {
        try {
            await navigator.clipboard.writeText(referralLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const shareOnTwitter = () => {
        const text = encodeURIComponent("Je viens de rejoindre la waitlist Verdikt — l'IA qui transforme les réunions interminables en décisions claires. 🚀\n\nRejoins aussi :");
        const url = encodeURIComponent(referralLink);
        window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
    };

    const shareOnLinkedIn = () => {
        const url = encodeURIComponent(referralLink);
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
    };

    // Reset state when modal opens and set selected plan
    useEffect(() => {
        if (isOpen) {
            setFirstName('');
            setEmail('');
            setCompany('');
            setWebsite('');
            setTeamSize('');
            setPlan(selectedPlan || '');
            setContactPreference('email');
            setPhone('');
            setIsSuccess(false);
            setError('');
        }
    }, [isOpen, selectedPlan]);

    // Close on Escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!firstName.trim()) {
            setError('Prénom requis');
            return;
        }
        if (!email || !email.includes('@')) {
            setError('Email professionnel invalide');
            return;
        }
        if (!company.trim()) {
            setError('Entreprise requise');
            return;
        }
        if (!teamSize) {
            setError('Taille d\'équipe requise');
            return;
        }
        if (!plan) {
            setError('Plan requis');
            return;
        }
        if (contactPreference === 'whatsapp' && !phone.trim()) {
            setError('Numéro WhatsApp requis');
            return;
        }

        setIsLoading(true);

        try {
            const { error } = await supabase.from('beta_registrations').insert({
                first_name: firstName.trim(),
                email: email.trim().toLowerCase(),
                company: company.trim(),
                website: website.trim() || null,
                team_size: teamSize,
                plan,
                contact_preference: contactPreference,
                phone: contactPreference === 'whatsapp' ? phone.trim() : null,
                referral_code: email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, ''),
            });

            if (error) {
                if (error.code === '23505') {
                    setError('Cet email est déjà inscrit sur la waitlist.');
                } else {
                    throw error;
                }
                setIsLoading(false);
                return;
            }

            // Send confirmation email (fire & forget — non-blocking)
            supabase.functions.invoke('send-email', {
                body: {
                    type: 'beta_confirmation',
                    data: {
                        email: email.trim().toLowerCase(),
                        firstName: firstName.trim(),
                        plan,
                    },
                },
            }).catch(() => {});

            setIsSuccess(true);
        } catch (err: any) {
            setError('Une erreur est survenue. Veuillez réessayer.');
        } finally {
            setIsLoading(false);
        }
        // No auto-close - let user share or close manually
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {/* Backdrop */}
                    <motion.div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={onClose}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />

                    {/* Modal */}
                    <motion.div
                        className="relative w-full max-w-md bg-card border border-border-subtle/20 rounded-2xl shadow-2xl overflow-hidden"
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{
                            type: 'spring',
                            damping: 25,
                            stiffness: 300,
                        }}
                    >
                        {/* Success confetti */}
                        {isSuccess && <Confetti />}

                        {/* Glow effect */}
                        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-emerald-500/20 rounded-full blur-[100px] pointer-events-none" />

                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 text-tertiary hover:text-primary rounded-full hover:bg-white/5 transition-colors z-10"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Content */}
                        <div className="relative p-8 pt-10">
                            <AnimatePresence mode="wait">
                                {!isSuccess ? (
                                    <motion.div
                                        key="form"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                    >
                                        {/* Header */}
                                        <div className="text-center mb-6">
                                            <motion.div
                                                className="mb-3 flex justify-center"
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ delay: 0.1, type: 'spring' }}
                                            >
                                                <LogoIcon size="lg" />
                                            </motion.div>
                                            <h3 className="text-xl font-bold text-primary mb-1">
                                                Rejoindre la Waitlist
                                            </h3>
                                            <p className="text-secondary text-sm">
                                                75 places Founding Member • Prix garanti à vie
                                            </p>
                                        </div>

                                        {/* Form */}
                                        <form onSubmit={handleSubmit} className="space-y-3">
                                            {/* Row 1: Prénom + Email */}
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label htmlFor="firstName" className="block text-xs font-medium text-secondary mb-1.5">
                                                        Prénom <span className="text-emerald-400">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="firstName"
                                                        value={firstName}
                                                        onChange={(e) => setFirstName(e.target.value)}
                                                        placeholder="Jean"
                                                        className="w-full px-3 py-2.5 bg-background border border-border-subtle/30 rounded-lg text-sm text-primary placeholder:text-tertiary focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                                                        autoFocus
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="email" className="block text-xs font-medium text-secondary mb-1.5">
                                                        Email pro <span className="text-emerald-400">*</span>
                                                    </label>
                                                    <input
                                                        type="email"
                                                        id="email"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        placeholder="vous@entreprise.com"
                                                        className="w-full px-3 py-2.5 bg-background border border-border-subtle/30 rounded-lg text-sm text-primary placeholder:text-tertiary focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                                                    />
                                                </div>
                                            </div>

                                            {/* Row 2: Entreprise + Site web */}
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label htmlFor="company" className="block text-xs font-medium text-secondary mb-1.5">
                                                        Entreprise <span className="text-emerald-400">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="company"
                                                        value={company}
                                                        onChange={(e) => setCompany(e.target.value)}
                                                        placeholder="Acme Inc."
                                                        className="w-full px-3 py-2.5 bg-background border border-border-subtle/30 rounded-lg text-sm text-primary placeholder:text-tertiary focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="website" className="block text-xs font-medium text-secondary mb-1.5">
                                                        Site web <span className="text-tertiary font-normal">(optionnel)</span>
                                                    </label>
                                                    <input
                                                        type="url"
                                                        id="website"
                                                        value={website}
                                                        onChange={(e) => setWebsite(e.target.value)}
                                                        placeholder="https://..."
                                                        className="w-full px-3 py-2.5 bg-background border border-border-subtle/30 rounded-lg text-sm text-primary placeholder:text-tertiary focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                                                    />
                                                </div>
                                            </div>

                                            {/* Row 3: Taille équipe + Plan */}
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label htmlFor="teamSize" className="block text-xs font-medium text-secondary mb-1.5">
                                                        Taille équipe <span className="text-emerald-400">*</span>
                                                    </label>
                                                    <div className="relative">
                                                        <select
                                                            id="teamSize"
                                                            value={teamSize}
                                                            onChange={(e) => setTeamSize(e.target.value)}
                                                            className="w-full px-3 py-2.5 bg-background border border-border-subtle/30 rounded-lg text-sm text-primary focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all appearance-none cursor-pointer"
                                                        >
                                                            <option value="" disabled>Sélectionner</option>
                                                            <option value="5-15">5-15 personnes</option>
                                                            <option value="15-30">15-30 personnes</option>
                                                            <option value="30-50">30-50 personnes</option>
                                                            <option value="50+">50+ personnes</option>
                                                        </select>
                                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-tertiary pointer-events-none" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label htmlFor="plan" className="block text-xs font-medium text-secondary mb-1.5">
                                                        Plan intéressé <span className="text-emerald-400">*</span>
                                                    </label>
                                                    <div className="relative">
                                                        <select
                                                            id="plan"
                                                            value={plan}
                                                            onChange={(e) => setPlan(e.target.value)}
                                                            className="w-full px-3 py-2.5 bg-background border border-border-subtle/30 rounded-lg text-sm text-primary focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all appearance-none cursor-pointer"
                                                        >
                                                            <option value="" disabled>Sélectionner</option>
                                                            <option value="Pro">Pro (20 membres)</option>
                                                            <option value="Business">Business (50 membres)</option>
                                                        </select>
                                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-tertiary pointer-events-none" />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Row 4: Contact preference */}
                                            <div>
                                                <label className="block text-xs font-medium text-secondary mb-1.5">
                                                    Comment souhaitez-vous être contacté ? <span className="text-emerald-400">*</span>
                                                </label>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <button
                                                        type="button"
                                                        onClick={() => setContactPreference('email')}
                                                        className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                                                            contactPreference === 'email'
                                                                ? 'bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400'
                                                                : 'bg-background border border-border-subtle/30 text-secondary hover:border-border-subtle/50'
                                                        }`}
                                                    >
                                                        <Mail className="w-4 h-4" />
                                                        Email
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setContactPreference('whatsapp')}
                                                        className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                                                            contactPreference === 'whatsapp'
                                                                ? 'bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400'
                                                                : 'bg-background border border-border-subtle/30 text-secondary hover:border-border-subtle/50'
                                                        }`}
                                                    >
                                                        <MessageCircle className="w-4 h-4" />
                                                        WhatsApp
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Phone field (shown when WhatsApp selected) */}
                                            <AnimatePresence>
                                                {contactPreference === 'whatsapp' && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        transition={{ duration: 0.2 }}
                                                    >
                                                        <label htmlFor="phone" className="block text-xs font-medium text-secondary mb-1.5">
                                                            Numéro WhatsApp <span className="text-emerald-400">*</span>
                                                        </label>
                                                        <input
                                                            type="tel"
                                                            id="phone"
                                                            value={phone}
                                                            onChange={(e) => setPhone(e.target.value)}
                                                            placeholder="+33 6 12 34 56 78"
                                                            className="w-full px-3 py-2.5 bg-background border border-border-subtle/30 rounded-lg text-sm text-primary placeholder:text-tertiary focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                                                        />
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>

                                            {error && (
                                                <motion.p
                                                    initial={{ opacity: 0, y: -5 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="text-red-400 text-sm"
                                                >
                                                    {error}
                                                </motion.p>
                                            )}

                                            <Button
                                                type="submit"
                                                variant="primary"
                                                className="w-full py-3.5 text-sm mt-1"
                                                disabled={isLoading}
                                            >
                                                {isLoading ? (
                                                    <span className="flex items-center gap-2">
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                        Inscription...
                                                    </span>
                                                ) : (
                                                    "Rejoindre la waitlist →"
                                                )}
                                            </Button>
                                        </form>

                                        <p className="text-xs text-tertiary text-center mt-3">
                                            Pas de spam. On vous contacte sous 24h.
                                        </p>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-center py-4"
                                    >
                                        {/* Success icon */}
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{
                                                type: 'spring',
                                                damping: 15,
                                                stiffness: 200,
                                                delay: 0.1,
                                            }}
                                            className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/30 mb-4"
                                        >
                                            <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                                        </motion.div>

                                        {/* Title */}
                                        <motion.h3
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2 }}
                                            className="text-xl font-bold text-primary mb-1"
                                        >
                                            Vous êtes sur la liste ! 🎉
                                        </motion.h3>

                                        {/* Subtitle */}
                                        <motion.p
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 }}
                                            className="text-secondary text-sm mb-4"
                                        >
                                            Votre place Founding Member est réservée.
                                        </motion.p>
                                        
                                        {/* Contact info card */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.4 }}
                                            className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-3 mb-5"
                                        >
                                            <div className="flex items-center justify-center gap-2 text-sm text-secondary">
                                                {contactPreference === 'email' ? (
                                                    <Mail className="w-4 h-4 text-emerald-400" />
                                                ) : (
                                                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                                                )}
                                                <span>
                                                    On vous contacte sous 24h via{' '}
                                                    <span className="text-emerald-400 font-medium">
                                                        {contactPreference === 'email' ? 'email' : 'WhatsApp'}
                                                    </span>
                                                </span>
                                            </div>
                                            <p className="text-xs text-tertiary mt-1">
                                                Prix garanti à vie • {plan === 'Pro' ? '790€/an' : '1 990€/an'}
                                            </p>
                                        </motion.div>

                                        {/* Referral section */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.5 }}
                                            className="border-t border-border-subtle/20 pt-5"
                                        >
                                            <div className="flex items-center justify-center gap-2 mb-3">
                                                <Gift className="w-4 h-4 text-amber-400" />
                                                <span className="text-sm font-medium text-primary">Passez devant dans la file</span>
                                            </div>
                                            <p className="text-xs text-secondary mb-4">
                                                Partagez Verdikt et gagnez <span className="text-amber-400 font-medium">1 mois offert</span> pour chaque inscription.
                                            </p>

                                            {/* Copy link button */}
                                            <button
                                                onClick={copyReferralLink}
                                                className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all mb-3 ${
                                                    copied
                                                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                                        : 'bg-background border border-border-subtle/30 text-secondary hover:border-border-subtle/50 hover:text-primary'
                                                }`}
                                            >
                                                {copied ? (
                                                    <>
                                                        <Check className="w-4 h-4" />
                                                        Lien copié !
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy className="w-4 h-4" />
                                                        Copier mon lien de parrainage
                                                    </>
                                                )}
                                            </button>

                                            {/* Social share buttons */}
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={shareOnLinkedIn}
                                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-[#0A66C2]/10 text-[#0A66C2] hover:bg-[#0A66C2]/20 transition-all"
                                                >
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                                    </svg>
                                                    LinkedIn
                                                </button>
                                                <button
                                                    onClick={shareOnTwitter}
                                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-zinc-800/80 text-white hover:bg-zinc-700 transition-all"
                                                >
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                                    </svg>
                                                    Twitter
                                                </button>
                                            </div>
                                        </motion.div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
