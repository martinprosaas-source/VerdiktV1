import { useTranslation } from 'react-i18next';

interface LanguageToggleProps {
    className?: string;
    variant?: 'default' | 'landing';
}

export const LanguageToggle = ({ className = '', variant = 'default' }: LanguageToggleProps) => {
    const { i18n } = useTranslation();
    const currentLang = i18n.language?.startsWith('en') ? 'en' : 'fr';

    const toggle = (lang: 'fr' | 'en') => {
        i18n.changeLanguage(lang);
    };

    if (variant === 'landing') {
        return (
            <div className={`flex items-center gap-0.5 bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-lg p-0.5 ${className}`}>
                <button
                    onClick={() => toggle('fr')}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                        currentLang === 'fr'
                            ? 'bg-white dark:bg-white/10 text-zinc-900 dark:text-white shadow-sm'
                            : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'
                    }`}
                >
                    FR
                </button>
                <button
                    onClick={() => toggle('en')}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                        currentLang === 'en'
                            ? 'bg-white dark:bg-white/10 text-zinc-900 dark:text-white shadow-sm'
                            : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'
                    }`}
                >
                    EN
                </button>
            </div>
        );
    }

    return (
        <div className={`flex items-center gap-0.5 bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-lg p-0.5 ${className}`}>
            <button
                onClick={() => toggle('fr')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                    currentLang === 'fr'
                        ? 'bg-white dark:bg-white/10 text-primary shadow-sm'
                        : 'text-tertiary hover:text-secondary'
                }`}
            >
                FR
            </button>
            <button
                onClick={() => toggle('en')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                    currentLang === 'en'
                        ? 'bg-white dark:bg-white/10 text-primary shadow-sm'
                        : 'text-tertiary hover:text-secondary'
                }`}
            >
                EN
            </button>
        </div>
    );
};
