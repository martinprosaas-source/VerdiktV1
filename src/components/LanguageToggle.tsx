import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, ChevronDown } from 'lucide-react';

interface LanguageToggleProps {
    className?: string;
    variant?: 'default' | 'landing';
}

const languages = [
    { code: 'fr', label: 'Français' },
    { code: 'en', label: 'English' },
] as const;

export const LanguageToggle = ({ className = '', variant = 'default' }: LanguageToggleProps) => {
    const { i18n } = useTranslation();
    const currentLang = i18n.language?.startsWith('en') ? 'en' : 'fr';
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const select = (lang: 'fr' | 'en') => {
        i18n.changeLanguage(lang);
        setOpen(false);
    };

    // Close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const buttonBase = variant === 'landing'
        ? 'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors'
        : 'flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium text-tertiary hover:text-primary hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors';

    const dropdownBase = variant === 'landing'
        ? 'absolute top-full mt-1 right-0 w-36 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-xl shadow-lg overflow-hidden z-50'
        : 'absolute bottom-full mb-1 right-0 w-36 bg-card border border-zinc-200 dark:border-white/10 rounded-xl shadow-lg overflow-hidden z-50';

    return (
        <div ref={ref} className={`relative ${className}`}>
            <button
                onClick={() => setOpen(!open)}
                className={buttonBase}
            >
                <Globe className="w-3.5 h-3.5" />
                <span className="uppercase">{currentLang}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>

            {open && (
                <div className={dropdownBase}>
                    {languages.map(lang => (
                        <button
                            key={lang.code}
                            onClick={() => select(lang.code)}
                            className={`flex items-center gap-2.5 w-full px-3 py-2 text-sm transition-colors ${
                                currentLang === lang.code
                                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium'
                                    : 'text-secondary hover:bg-zinc-50 dark:hover:bg-white/5 hover:text-primary'
                            }`}
                        >
                            <Globe className="w-3.5 h-3.5 flex-shrink-0" />
                            {lang.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
