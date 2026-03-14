import { useTranslation } from 'react-i18next';
import { Section, FadeIn } from './ui/Section';
import { motion } from 'framer-motion';

const stepsConfig = [
    { key: 'step1', visual: '?' },
    { key: 'step2', visual: '→' },
    { key: 'step3', visual: '✓' },
];

export const HowItWorks = () => {
    const { t } = useTranslation();

    return (
        <Section id="how-it-works" className="py-28 sm:py-40 bg-background relative overflow-hidden transition-colors duration-300">
            {/* Subtle grid background */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
                {/* Header - Left aligned, bold */}
                <FadeIn className="mb-20 sm:mb-28">
                    <p className="text-emerald-500 font-mono text-sm tracking-wider mb-4">{t('landing.how.label')}</p>
                    <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-primary leading-[0.9] tracking-tight">
                        {t('landing.how.title1')}
                        <br />
                        <span className="text-tertiary">{t('landing.how.title2')}</span>
                    </h2>
                </FadeIn>

                {/* Timeline - Horizontal on desktop */}
                <div className="relative">
                    {/* Connection line - Desktop */}
                    <div className="hidden lg:block absolute top-[140px] left-0 right-0 h-px">
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/50 via-emerald-500/20 to-transparent" />
                        <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: '100%' }}
                            transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
                            viewport={{ once: true }}
                            className="absolute inset-y-0 left-0 bg-emerald-500"
                        />
                    </div>

                    {/* Steps */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8">
                        {stepsConfig.map((step, index) => (
                            <FadeIn key={step.key} delay={0.15 * index}>
                                <motion.div
                                    whileHover={{ x: 4 }}
                                    transition={{ duration: 0.2 }}
                                    className="group relative"
                                >
                                    {/* Large number */}
                                    <div className="flex items-start gap-6 mb-6 lg:mb-8">
                                        <span className="text-[80px] sm:text-[100px] lg:text-[160px] font-black leading-none text-transparent bg-clip-text bg-gradient-to-b from-emerald-500/20 to-transparent select-none">
                                            {t(`landing.how.${step.key}.num`)}
                                        </span>
                                    </div>

                                    {/* Dot indicator - Desktop */}
                                    <div className="hidden lg:flex absolute top-[132px] left-0 items-center justify-center">
                                        <div className="w-4 h-4 rounded-full bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]" />
                                    </div>

                                    {/* Content */}
                                    <div className="lg:pt-12 lg:pl-0">
                                        <h3 className="text-2xl sm:text-3xl font-bold text-primary mb-1 tracking-tight">
                                            {t(`landing.how.${step.key}.title`)}{' '}
                                            <span className="text-emerald-500">{t(`landing.how.${step.key}.highlight`)}</span>
                                        </h3>
                                        <p className="text-base sm:text-lg text-secondary leading-relaxed max-w-sm">
                                            {t(`landing.how.${step.key}.desc`)}
                                        </p>
                                    </div>

                                    {/* Hover accent */}
                                    <div className="absolute -left-4 top-0 bottom-0 w-1 bg-emerald-500 scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-300 rounded-full" />
                                </motion.div>
                            </FadeIn>
                        ))}
                    </div>
                </div>

            </div>
        </Section>
    );
};
