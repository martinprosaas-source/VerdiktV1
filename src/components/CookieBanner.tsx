import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie } from 'lucide-react';

const STORAGE_KEY = 'verdikt_cookie_consent';

export const CookieBanner = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem(STORAGE_KEY);
        if (!consent) {
            const t = setTimeout(() => setVisible(true), 1200);
            return () => clearTimeout(t);
        }
    }, []);

    const accept = () => {
        localStorage.setItem(STORAGE_KEY, 'accepted');
        setVisible(false);
    };

    const decline = () => {
        localStorage.setItem(STORAGE_KEY, 'declined');
        setVisible(false);
    };

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-xl px-4"
                >
                    <div className="bg-zinc-900/95 backdrop-blur-xl border border-white/10 rounded-2xl px-5 py-4 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                            <div className="shrink-0 w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mt-0.5">
                                <Cookie className="w-4 h-4 text-emerald-400" />
                            </div>
                            <p className="text-sm text-zinc-300 leading-relaxed">
                                Uniquement des cookies essentiels.{' '}
                                <Link to="/privacy" className="text-emerald-400 hover:text-emerald-300 transition-colors underline underline-offset-2">
                                    En savoir plus
                                </Link>
                            </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                            <button
                                onClick={decline}
                                className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all"
                            >
                                Refuser
                            </button>
                            <button
                                onClick={accept}
                                className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-400 rounded-xl transition-all"
                            >
                                Accepter
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
