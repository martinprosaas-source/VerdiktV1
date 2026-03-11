import { useTranslation } from 'react-i18next';
import { Section, FadeIn } from './ui/Section';
import { motion } from 'framer-motion';

const statsConfig = [
    { number: '71', suffix: '%', labelKey: 'landing.problem.stat1.label', descKey: 'landing.problem.stat1.desc' },
    { number: '58', suffix: '%', labelKey: 'landing.problem.stat2.label', descKey: 'landing.problem.stat2.desc' },
    { number: '5', suffix: '%', labelKey: 'landing.problem.stat3.label', descKey: 'landing.problem.stat3.desc' },
];

export const Problem = () => {
    const { t } = useTranslation();

    return (
        <Section className="py-28 sm:py-40 bg-background relative overflow-hidden transition-colors duration-300">
            {/* Background accent */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-red-500/5 to-transparent pointer-events-none" />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
                {/* Header */}
                <FadeIn className="mb-20 sm:mb-28">
                    <p className="text-red-500 font-mono text-sm tracking-wider mb-4">{t('landing.problem.label')}</p>
                    <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-primary leading-[0.9] tracking-tight max-w-4xl">
                        {t('landing.problem.title1')}
                        <br />
                        <span className="text-tertiary">{t('landing.problem.title2')}</span>
                    </h2>
                </FadeIn>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4">
                    {statsConfig.map((stat, index) => (
                        <FadeIn key={stat.number} delay={0.1 * index}>
                            <motion.div
                                whileHover={{ y: -4 }}
                                className="group relative"
                            >
                                {/* Card */}
                                <div className="relative p-6 sm:p-8 md:p-10 rounded-2xl bg-card/50 border border-zinc-200 dark:border-white/5 hover:border-red-500/20 transition-colors duration-300">
                                    {/* Number */}
                                    <div className="mb-4 sm:mb-6">
                                        <span className="text-[60px] sm:text-[80px] md:text-[100px] font-black leading-none text-transparent bg-clip-text bg-gradient-to-b from-primary to-primary/20">
                                            {stat.number}
                                        </span>
                                        {stat.suffix && (
                                            <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-red-500">
                                                {stat.suffix}
                                            </span>
                                        )}
                                    </div>

                                    {/* Label */}
                                    <p className="text-sm font-medium text-red-500 uppercase tracking-wide mb-3">
                                        {t(stat.labelKey)}
                                    </p>

                                    {/* Description */}
                                    <p className="text-base sm:text-lg text-secondary leading-relaxed">
                                        {t(stat.descKey)}
                                    </p>

                                    {/* Hover accent */}
                                    <div className="absolute bottom-0 left-8 right-8 h-1 bg-gradient-to-r from-red-500/0 via-red-500/50 to-red-500/0 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-full" />
                                </div>
                            </motion.div>
                        </FadeIn>
                    ))}
                </div>

                {/* Sources */}
                <FadeIn delay={0.4}>
                    <div className="mt-12 sm:mt-16 text-center">
                        <p className="text-xs sm:text-sm text-tertiary">
                            {t('landing.problem.source')}
                        </p>
                    </div>
                </FadeIn>
            </div>
        </Section>
    );
};
