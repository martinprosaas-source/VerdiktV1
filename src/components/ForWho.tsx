import { useTranslation } from 'react-i18next';
import { Section, FadeIn } from './ui/Section';
import { motion } from 'framer-motion';

const painKeys = ['pain1', 'pain2', 'pain3', 'pain4', 'pain5'];
const painNumbers = ['01', '02', '03', '04', '05'];

export const ForWho = () => {
    const { t } = useTranslation();

    return (
        <Section className="py-32 sm:py-44 bg-background relative overflow-hidden transition-colors duration-300">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                {/* Header - minimal */}
                <FadeIn className="mb-16 sm:mb-24">
                    <p className="text-emerald-500 font-mono text-sm tracking-wider mb-4 uppercase">{t('landing.forWho.label')}</p>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary leading-[1.1] tracking-tight">
                        {t('landing.forWho.title')}
                    </h2>
                </FadeIn>

                {/* Pain points - clean list */}
                <div className="space-y-0">
                    {painKeys.map((key, index) => (
                        <FadeIn key={key} delay={0.1 + index * 0.08}>
                            <motion.div
                                whileHover={{ x: 8 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                                className="group py-6 sm:py-8 border-t border-zinc-200 dark:border-white/5 cursor-default"
                            >
                                <div className="flex items-start gap-4 sm:gap-6 md:gap-8">
                                    {/* Number */}
                                    <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-zinc-200 dark:text-white/5 group-hover:text-emerald-500/30 transition-colors duration-300 flex-shrink-0">
                                        {painNumbers[index]}
                                    </span>

                                    {/* Arrow + Text */}
                                    <div className="flex items-center gap-3 sm:gap-4 pt-1 sm:pt-2">
                                        <span className="text-emerald-500 text-xl sm:text-2xl group-hover:translate-x-1 transition-transform duration-300">
                                            →
                                        </span>
                                        <p className="text-lg sm:text-xl md:text-2xl text-secondary group-hover:text-primary transition-colors duration-300 leading-snug">
                                            {t(`landing.forWho.${key}`)}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        </FadeIn>
                    ))}
                </div>

                {/* Bottom line */}
                <div className="border-t border-zinc-200 dark:border-white/5" />
            </div>
        </Section>
    );
};
