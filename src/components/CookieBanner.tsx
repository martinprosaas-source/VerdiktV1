import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';

const STORAGE_KEY = 'verdikt_cookie_consent';

export const CookieBanner = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem(STORAGE_KEY);
        if (!consent) {
            // Small delay for better UX
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

    if (!visible) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:max-w-sm z-50 animate-in slide-in-from-bottom-4 duration-300">
            <div className="bg-zinc-900 border border-white/10 rounded-xl p-5 shadow-2xl">
                <div className="flex items-start justify-between gap-3 mb-3">
                    <p className="text-sm text-zinc-300 leading-relaxed">
                        Verdikt utilise uniquement des cookies essentiels au fonctionnement du service.{' '}
                        <Link to="/privacy" className="text-emerald-400 hover:underline">
                            En savoir plus
                        </Link>
                    </p>
                    <button
                        onClick={decline}
                        className="text-zinc-500 hover:text-white transition-colors shrink-0 mt-0.5"
                        aria-label="Fermer"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={accept}
                        className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                        Accepter
                    </button>
                    <button
                        onClick={decline}
                        className="flex-1 bg-white/5 hover:bg-white/10 text-zinc-300 text-sm font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                        Refuser
                    </button>
                </div>
            </div>
        </div>
    );
};
