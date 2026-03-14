import { useTranslation } from 'react-i18next';
import { Section, FadeIn } from './ui/Section';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { SlackLogo, NotionLogo, GoogleCalendarLogo } from './icons/IntegrationLogos';

const integrations = [
    {
        key: 'slack',
        Logo: SlackLogo,
        color: 'from-[#4A154B]/20 via-[#4A154B]/10 to-transparent',
        border: 'border-[#4A154B]/30 hover:border-[#4A154B]/50',
        dot: 'bg-purple-400',
        featureKeys: ['f1', 'f2', 'f3', 'f4'],
    },
    {
        key: 'notion',
        Logo: NotionLogo,
        color: 'from-zinc-500/10 via-zinc-500/5 to-transparent',
        border: 'border-zinc-400/20 hover:border-zinc-400/40',
        dot: 'bg-zinc-300',
        featureKeys: ['f1', 'f2', 'f3', 'f4'],
    },
    {
        key: 'gcal',
        Logo: GoogleCalendarLogo,
        color: 'from-blue-500/10 via-blue-500/5 to-transparent',
        border: 'border-blue-500/20 hover:border-blue-500/40',
        dot: 'bg-blue-400',
        featureKeys: ['f1', 'f2', 'f3', 'f4'],
    },
];

export const Integrations = () => {
    const { t } = useTranslation();

    return (
        <Section className="py-28 sm:py-40 bg-background relative overflow-hidden transition-colors duration-300">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.015)_1px,transparent_1px)] bg-[size:60px_60px]" />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
                {/* Header */}
                <FadeIn className="mb-16 sm:mb-20">
                    <p className="text-emerald-500 font-mono text-sm tracking-wider mb-4">
                        {t('landing.integrations.label')}
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
                        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary leading-[0.95] tracking-tight max-w-2xl">
                            {t('landing.integrations.title1')}
                            <br />
                            <span className="text-tertiary">{t('landing.integrations.title2')}</span>
                        </h2>
                        <p className="text-secondary max-w-xs text-sm sm:text-base pb-1">
                            {t('landing.integrations.subtitle')}
                        </p>
                    </div>
                </FadeIn>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {integrations.map((integration, i) => {
                        const { Logo } = integration;
                        return (
                            <FadeIn key={integration.key} delay={0.1 * i}>
                                <motion.div
                                    whileHover={{ y: -5 }}
                                    className={`relative h-full p-7 rounded-2xl bg-gradient-to-br ${integration.color} border ${integration.border} transition-all duration-300`}
                                >
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                                                <Logo className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-primary text-base">
                                                    {t(`landing.integrations.${integration.key}.name`)}
                                                </h3>
                                                <div className="flex items-center gap-1.5 mt-0.5">
                                                    <div className={`w-1.5 h-1.5 rounded-full ${integration.dot}`} />
                                                    <span className="text-xs text-secondary">
                                                        {t('landing.integrations.available')}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Hook */}
                                    <p className="text-sm text-primary font-medium mb-5 leading-relaxed">
                                        {t(`landing.integrations.${integration.key}.hook`)}
                                    </p>

                                    {/* Features */}
                                    <ul className="space-y-2.5">
                                        {integration.featureKeys.map((fk) => (
                                            <li key={fk} className="flex items-start gap-2.5">
                                                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                                <span className="text-sm text-secondary">
                                                    {t(`landing.integrations.${integration.key}.${fk}`)}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>
                            </FadeIn>
                        );
                    })}
                </div>

                {/* Bottom note */}
                <FadeIn delay={0.4}>
                    <div className="mt-10 flex items-center justify-center gap-2">
                        <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                        <p className="text-center text-base font-medium text-primary">
                            {t('landing.integrations.note')}
                        </p>
                    </div>
                </FadeIn>
            </div>
        </Section>
    );
};
