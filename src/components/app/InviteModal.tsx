import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, UserPlus, Copy, Check, Link, ChevronDown, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface InviteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export const InviteModal = ({ isOpen, onClose, onSuccess }: InviteModalProps) => {
    const [emails, setEmails] = useState<string[]>([]);
    const [emailInput, setEmailInput] = useState('');
    const [role, setRole] = useState<'admin' | 'member'>('member');
    const [copied, setCopied] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successCount, setSuccessCount] = useState(0);

    const inviteLink = `${window.location.origin}/signup`;

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setEmails([]);
            setEmailInput('');
            setRole('member');
            setIsSuccess(false);
            setErrorMessage('');
            setSuccessCount(0);
        }
    }, [isOpen]);

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

    const isValidEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const addEmail = () => {
        const email = emailInput.trim().toLowerCase();
        if (email && isValidEmail(email) && !emails.includes(email)) {
            setEmails([...emails, email]);
            setEmailInput('');
        }
    };

    const removeEmail = (email: string) => {
        setEmails(emails.filter(e => e !== email));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addEmail();
        }
        if (e.key === 'Backspace' && !emailInput && emails.length > 0) {
            removeEmail(emails[emails.length - 1]);
        }
    };

    const copyLink = async () => {
        await navigator.clipboard.writeText(inviteLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSubmit = async () => {
        if (emails.length === 0) return;
        
        setIsLoading(true);
        setErrorMessage('');

        try {
            const { data, error } = await supabase.functions.invoke('invite-member', {
                body: { emails, role },
            });

            if (error) throw error;

            if (data?.success) {
                setSuccessCount(data.sent || emails.length);
                setIsSuccess(true);
                onSuccess?.();
                setTimeout(() => onClose(), 3000);
            } else {
                const failedEmails = (data?.results || [])
                    .filter((r: any) => !r.success)
                    .map((r: any) => r.email)
                    .join(', ');
                setErrorMessage(failedEmails
                    ? `Échec pour : ${failedEmails}`
                    : 'Une erreur est survenue.');
            }
        } catch (err: any) {
            setErrorMessage(err.message || 'Erreur lors de l\'envoi des invitations.');
        } finally {
            setIsLoading(false);
        }
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
                        className="relative w-full max-w-md bg-card border border-zinc-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    >
                        {/* Glow effect */}
                        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-emerald-500/20 rounded-full blur-[100px] pointer-events-none" />

                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 text-tertiary hover:text-primary rounded-full hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors z-10"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Content */}
                        <div className="relative p-6">
                            <AnimatePresence mode="wait">
                                {!isSuccess ? (
                                    <motion.div
                                        key="form"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                    >
                                        {/* Header */}
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                                                <UserPlus className="w-5 h-5 text-emerald-500" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-primary">
                                                    Inviter des membres
                                                </h3>
                                                <p className="text-sm text-tertiary">
                                                    Ajoutez des collaborateurs à votre équipe
                                                </p>
                                            </div>
                                        </div>

                                        {/* Email input */}
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-primary mb-2">
                                                    Emails
                                                </label>
                                                <div className="flex gap-2">
                                                    <div className="relative flex-1">
                                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-tertiary" />
                                                        <input
                                                            type="email"
                                                            value={emailInput}
                                                            onChange={(e) => setEmailInput(e.target.value)}
                                                            onKeyDown={handleKeyDown}
                                                            placeholder="collegue@entreprise.com"
                                                            className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl text-sm text-primary placeholder:text-tertiary focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                                                        />
                                                    </div>
                                                    <motion.button
                                                        onClick={addEmail}
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        disabled={!emailInput || !isValidEmail(emailInput)}
                                                        className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-200 dark:disabled:bg-white/10 disabled:text-tertiary text-white text-sm font-medium rounded-xl transition-colors"
                                                    >
                                                        Ajouter
                                                    </motion.button>
                                                </div>
                                            </div>

                                            {/* Email chips */}
                                            <AnimatePresence>
                                                {emails.length > 0 && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        className="flex flex-wrap gap-2"
                                                    >
                                                        {emails.map((email) => (
                                                            <motion.div
                                                                key={email}
                                                                initial={{ opacity: 0, scale: 0.8 }}
                                                                animate={{ opacity: 1, scale: 1 }}
                                                                exit={{ opacity: 0, scale: 0.8 }}
                                                                className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-sm"
                                                            >
                                                                <span>{email}</span>
                                                                <button
                                                                    onClick={() => removeEmail(email)}
                                                                    className="w-4 h-4 rounded-full hover:bg-emerald-500/20 flex items-center justify-center"
                                                                >
                                                                    <X className="w-3 h-3" />
                                                                </button>
                                                            </motion.div>
                                                        ))}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>

                                            {/* Role selector */}
                                            <div>
                                                <label className="block text-sm font-medium text-primary mb-2">
                                                    Rôle
                                                </label>
                                                <div className="relative">
                                                    <select
                                                        value={role}
                                                        onChange={(e) => setRole(e.target.value as 'admin' | 'member')}
                                                        className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl text-sm text-primary focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all appearance-none cursor-pointer"
                                                    >
                                                        <option value="member">Membre</option>
                                                        <option value="admin">Admin</option>
                                                    </select>
                                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-tertiary pointer-events-none" />
                                                </div>
                                                <p className="text-xs text-tertiary mt-1.5">
                                                    {role === 'admin' 
                                                        ? 'Les admins peuvent gérer les membres et les paramètres.'
                                                        : 'Les membres peuvent créer et participer aux décisions.'
                                                    }
                                                </p>
                                            </div>

                                            {/* Divider */}
                                            <div className="relative py-2">
                                                <div className="absolute inset-0 flex items-center">
                                                    <div className="w-full border-t border-zinc-200 dark:border-white/10" />
                                                </div>
                                                <div className="relative flex justify-center text-xs">
                                                    <span className="px-3 bg-card text-tertiary">ou partagez le lien</span>
                                                </div>
                                            </div>

                                            {/* Invite link */}
                                            <div className="flex items-center gap-2 p-3 bg-zinc-50 dark:bg-white/5 rounded-xl border border-zinc-200 dark:border-white/10">
                                                <Link className="w-4 h-4 text-tertiary flex-shrink-0" />
                                                <span className="flex-1 text-xs text-secondary font-mono truncate">
                                                    {inviteLink}
                                                </span>
                                                <motion.button
                                                    onClick={copyLink}
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                                        copied 
                                                            ? 'bg-emerald-500 text-white' 
                                                            : 'bg-zinc-200 dark:bg-white/10 text-primary hover:bg-zinc-300 dark:hover:bg-white/20'
                                                    }`}
                                                >
                                                    {copied ? (
                                                        <>
                                                            <Check className="w-3 h-3" />
                                                            Copié
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Copy className="w-3 h-3" />
                                                            Copier
                                                        </>
                                                    )}
                                                </motion.button>
                                            </div>
                                        </div>

                                        {/* Error message */}
                                        {errorMessage && (
                                            <p className="mt-3 text-xs text-red-500 font-medium">
                                                {errorMessage}
                                            </p>
                                        )}

                                        {/* Actions */}
                                        <div className="flex gap-3 mt-6">
                                            <button
                                                onClick={onClose}
                                                className="flex-1 px-4 py-2.5 bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 text-primary text-sm font-medium rounded-xl transition-colors"
                                            >
                                                Annuler
                                            </button>
                                            <motion.button
                                                onClick={handleSubmit}
                                                disabled={emails.length === 0 || isLoading}
                                                whileHover={{ scale: emails.length > 0 ? 1.02 : 1 }}
                                                whileTap={{ scale: emails.length > 0 ? 0.98 : 1 }}
                                                className="flex-1 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-200 dark:disabled:bg-white/10 disabled:text-tertiary text-white text-sm font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
                                            >
                                                {isLoading ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                        Envoi...
                                                    </>
                                                ) : (
                                                    <>
                                                        Envoyer {emails.length > 0 && `(${emails.length})`}
                                                    </>
                                                )}
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-center py-8"
                                    >
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: 'spring', damping: 15, stiffness: 200 }}
                                            className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/30 mb-4"
                                        >
                                            <Check className="w-7 h-7 text-emerald-500" />
                                        </motion.div>
                                        <h3 className="text-lg font-semibold text-primary mb-1">
                                            Invitations envoyées !
                                        </h3>
                                        <p className="text-sm text-secondary">
                                            {successCount} invitation{successCount > 1 ? 's' : ''} envoyée{successCount > 1 ? 's' : ''} avec succès.
                                        </p>
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
