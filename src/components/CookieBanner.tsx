import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

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
                    initial={{ y: 60, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 60, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/[0.06] bg-zinc-950/95 backdrop-blur-xl"
                >
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <p className="text-xs text-zinc-400 text-center sm:text-left">
                            Verdikt utilise uniquement des cookies essentiels au fonctionnement du service.{' '}
                            <Link to="/privacy" className="text-zinc-300 hover:text-white underline underline-offset-2 transition-colors">
                                En savoir plus
                            </Link>
                        </p>
                        <div className="flex items-center gap-2 shrink-0">
                            <button
                                onClick={decline}
                                className="px-3 py-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-300 transition-colors"
                            >
                                Refuser
                            </button>
                            <button
                                onClick={accept}
                                className="px-4 py-1.5 text-xs font-medium text-white bg-emerald-500 hover:bg-emerald-400 rounded-lg transition-colors"
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
