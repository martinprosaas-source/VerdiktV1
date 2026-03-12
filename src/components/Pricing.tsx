import { useTranslation } from 'react-i18next';
import { Section, FadeIn } from './ui/Section';
import { Check, ArrowRight, Crown, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useBetaModal, type SelectedPlan } from '../context/BetaModalContext';

const plansConfig = [
    {
        key: 'free',
        price: '0',
        period: '€',
        hasOriginalPrice: false,
        hasMonthly: false,
        hasPerUser: false,
        highlighted: false,
        founding: false,
        isFree: true,
        featureKeys: ['f1', 'f2', 'f3'],
    },
    {
        key: 'pro',
        price: '790',
        period: '€/an',
        hasOriginalPrice: true,
        hasMonthly: true,
        hasPerUser: true,
        highlighted: true,
        founding: true,
        isFree: false,
        featureKeys: ['f1', 'f2', 'f3', 'f4'],
    },
    {
        key: 'business',
        price: '1 990',
        period: '€/an',
        hasOriginalPrice: true,
        hasMonthly: true,
        hasPerUser: true,
        highlighted: false,
        founding: true,
        isFree: false,
        featureKeys: ['f1', 'f2', 'f3'],
    },
];

export const Pricing = () => {
    const { openBetaModal } = useBetaModal();
    const { t } = useTranslation();

    return (
        <Section id="pricing" className="py-28 sm:py-40 bg-background relative overflow-hidden transition-colors duration-300">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                {/* Header */}
                <FadeIn className="mb-16 sm:mb-20 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6">
                        <Crown className="w-4 h-4 text-amber-500" />
                        <span className="text-sm font-semibold text-amber-500">{t('landing.pricing.badge')}</span>
                    </div>
                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary leading-[0.95] tracking-tight mb-4">
                        {t('landing.pricing.title1')}
                        <br />
                        <span className="text-tertiary">{t('landing.pricing.title2')}</span>
                    </h2>
                    <p className="text-lg text-secondary max-w-xl mx-auto">
                        {t('landing.pricing.subtitle')}
                    </p>
                </FadeIn>

                {/* Plans grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 mb-12">
                    {plansConfig.map((plan, index) => (
                        <FadeIn key={plan.key} delay={0.1 * index}>
                            <motion.div
                                whileHover={{ y: -6 }}
                                className={`
                                    relative h-full p-6 sm:p-8 rounded-2xl transition-all duration-300
                                    ${plan.highlighted 
                                        ? 'bg-gradient-to-b from-emerald-500/10 via-emerald-500/5 to-transparent border-2 border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.15)]' 
                                        : 'bg-card/50 border border-zinc-200 dark:border-white/5 hover:border-zinc-300 dark:hover:border-white/10'
                                    }
                                `}
                            >
                                {/* Founding badge */}
                                {plan.founding && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-amber-500 to-amber-600 text-black text-xs font-bold rounded-full shadow-lg">
                                        -33%
                                    </div>
                                )}

                                {/* Plan header */}
                                <div className="mb-6">
                                    <div className="flex items-center justify-between mb-1">
                                        <p className={`text-lg font-bold ${plan.highlighted ? 'text-emerald-500' : 'text-primary'}`}>
                                            {t(`landing.pricing.${plan.key}.name`)}
                                        </p>
                                        <span className="text-xs text-tertiary bg-zinc-100 dark:bg-white/5 px-2 py-1 rounded-full">
                                            {t(`landing.pricing.${plan.key}.members`)}
                                        </span>
                                    </div>
                                    
                                    {/* Price */}
                                    <div className="mt-4">
                                        {plan.hasOriginalPrice && (
                                            <p className="text-sm text-tertiary line-through mb-1">
                                                {t(`landing.pricing.${plan.key}.originalPrice`)}
                                            </p>
                                        )}
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-4xl sm:text-5xl font-bold text-primary">{plan.price}</span>
                                            <span className="text-base text-tertiary">{plan.isFree ? t('landing.pricing.free.period') : t('landing.pricing.period')}</span>
                                        </div>
                                        {plan.hasMonthly && (
                                            <p className="text-sm text-secondary mt-1">
                                                {t(`landing.pricing.${plan.key}.monthly`)}
                                            </p>
                                        )}
                                        {plan.hasPerUser && (
                                            <p className="text-xs text-emerald-500 font-medium mt-1">
                                                {t(`landing.pricing.${plan.key}.perUser`)}
                                            </p>
                                        )}
                                        {plan.isFree && (
                                            <p className="text-sm text-secondary mt-1">
                                                {t('landing.pricing.free.forever')}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Features */}
                                <ul className="space-y-3 mb-8">
                                    {plan.featureKeys.map((fk) => (
                                        <li key={fk} className="flex items-center gap-2.5">
                                            <Check className={`w-4 h-4 flex-shrink-0 ${plan.highlighted ? 'text-emerald-500' : 'text-emerald-500/60'}`} />
                                            <span className="text-sm text-secondary">{t(`landing.pricing.${plan.key}.${fk}`)}</span>
                                        </li>
                                    ))}
                                </ul>

                                {/* CTA */}
                                {plan.isFree ? (
                                    <div className="w-full py-3.5 rounded-xl font-medium text-sm bg-zinc-100 dark:bg-white/5 text-tertiary border border-zinc-200 dark:border-white/10 flex items-center justify-center gap-2 cursor-not-allowed">
                                        <Clock className="w-4 h-4" />
                                        {t('landing.pricing.free.cta')}
                                    </div>
                                ) : (
                                    <motion.button
                                        onClick={() => openBetaModal(t(`landing.pricing.${plan.key}.name`) as SelectedPlan)}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`
                                            w-full py-3.5 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 text-sm
                                            ${plan.highlighted 
                                                ? 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_0_30px_rgba(16,185,129,0.3)]' 
                                                : 'bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 text-primary border border-zinc-200 dark:border-white/10'
                                            }
                                        `}
                                    >
                                        {t(`landing.pricing.${plan.key}.cta`)}
                                        <ArrowRight className="w-4 h-4" />
                                    </motion.button>
                                )}
                            </motion.div>
                        </FadeIn>
                    ))}
                </div>

                {/* Guarantees */}
                <FadeIn delay={0.4}>
                    <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-secondary mb-8">
                        <span className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-emerald-500" />
                            {t('landing.pricing.g1')}
                        </span>
                        <span className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-emerald-500" />
                            {t('landing.pricing.g2')}
                        </span>
                        <span className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-emerald-500" />
                            {t('landing.pricing.g3')}
                        </span>
                    </div>
                </FadeIn>

                {/* Post-beta note */}
                <FadeIn delay={0.5}>
                    <div className="mt-8 pt-8 border-t border-zinc-200 dark:border-white/5">
                        <div className="flex flex-col items-center gap-2">
                            <div className="flex items-center gap-2 text-sm">
                                <Clock className="w-4 h-4 text-amber-500" />
                                <span className="text-secondary">
                                    {t('landing.pricing.postBeta')}
                                </span>
                            </div>
                            <p className="text-xs text-emerald-500 font-medium">
                                {t('landing.pricing.postBetaNote')}
                            </p>
                        </div>
                    </div>
                </FadeIn>
            </div>
        </Section>
    );
};
