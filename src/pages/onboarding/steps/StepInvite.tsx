import { useEffect, useState } from 'react';
import { useOnboarding } from '../../../context/OnboardingContext';
import { Mail, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const StepInvite = () => {
    const { data, updateData, setCanGoNext } = useOnboarding();
    const [emailInput, setEmailInput] = useState('');

    // This step is optional, so always allow next
    useEffect(() => {
        setCanGoNext(true);
    }, [setCanGoNext]);

    const addEmail = () => {
        const email = emailInput.trim();
        if (email && isValidEmail(email) && !data.inviteEmails.includes(email)) {
            updateData({ inviteEmails: [...data.inviteEmails, email] });
            setEmailInput('');
        }
    };

    const removeEmail = (email: string) => {
        updateData({ inviteEmails: data.inviteEmails.filter(e => e !== email) });
    };

    const isValidEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addEmail();
        }
    };

    return (
        <div className="space-y-6">
            {/* Info banner */}
            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <p className="text-sm text-blue-600 dark:text-blue-400">
                    💡 Vous pouvez aussi inviter des membres plus tard depuis les paramètres.
                </p>
            </div>

            {/* Email input */}
            <div>
                <label className="block text-sm font-medium text-primary mb-2">
                    Inviter par email
                </label>
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-tertiary" />
                        <input
                            type="email"
                            value={emailInput}
                            onChange={(e) => setEmailInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="collegue@entreprise.com"
                            className="w-full pl-11 pr-4 py-3 bg-card border border-zinc-200 dark:border-white/10 rounded-xl text-primary placeholder:text-tertiary focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                        />
                    </div>
                    <motion.button
                        onClick={addEmail}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={!emailInput || !isValidEmail(emailInput)}
                        className="px-4 py-3 bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-200 dark:disabled:bg-white/10 disabled:text-tertiary text-white font-medium rounded-xl transition-colors"
                    >
                        Ajouter
                    </motion.button>
                </div>
            </div>

            {/* Email chips */}
            <AnimatePresence>
                {data.inviteEmails.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex flex-wrap gap-2"
                    >
                        {data.inviteEmails.map((email) => (
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

            {/* Summary */}
            {data.inviteEmails.length > 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl"
                >
                    <p className="text-sm text-primary">
                        <span className="font-medium text-emerald-500">{data.inviteEmails.length}</span> invitation{data.inviteEmails.length > 1 ? 's' : ''} ser{data.inviteEmails.length > 1 ? 'ont' : 'a'} envoyée{data.inviteEmails.length > 1 ? 's' : ''} par email à la fin de l'onboarding.
                    </p>
                </motion.div>
            )}
        </div>
    );
};
