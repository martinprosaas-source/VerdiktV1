import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Section, FadeIn } from './ui/Section';
import { Check, ArrowRight, Crown, Clock, TrendingDown, SlidersHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import { useBetaModal } from '../context/BetaModalContext';

const BETA_PRICE = 3.75;
const POST_BETA_PRICE = 5.75;
const SLACK_PRICE = 6.7;

const fmt = (n: number) => n.toFixed(2).replace('.', ',');
const fmtInt = (n: number) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

const PricingCalculatorCard = () => {
    const { t } = useTranslation();
    const { openBetaModal } = useBetaModal();
    const [users, setUsers] = useState(12);

    const isFree = users <= 5;
    const betaTotal = fmt(users * BETA_PRICE);
    const betaAnnual = fmtInt(users * BETA_PRICE * 12);
    const postBetaTotal = fmt(users * POST_BETA_PRICE);
    const slackTotal = fmt(users * SLACK_PRICE);
    const savings = fmt(users * (POST_BETA_PRICE - BETA_PRICE));

    return (
        <motion.div
            whileHover={{ y: -6 }}
            className="relative h-full p-6 sm:p-8 rounded-2xl bg-card/50 border border-zinc-200 dark:border-white/5 hover:border-zinc-300 dark:hover:border-white/10 transition-all duration-300 flex flex-col"
        >
            {/* Card header */}
            <div className="mb-5">
                <div className="flex items-center justify-between mb-1">
                    <p className="text-lg font-bold text-primary flex items-center gap-2">
                        <SlidersHorizontal className="w-4 h-4 text-amber-500" />
                        {t('landing.pricing.calc.cardTitle')}
                    </p>
                    <span className="text-xs text-tertiary bg-zinc-100 dark:bg-white/5 px-2 py-1 rounded-full">
                        {t('landing.pricing.calc.cardMembers')}
                    </span>
                </div>

                {/* Slider area — replaces the price block */}
                <div className="mt-4">
                    <p className="text-sm text-secondary mb-3">{t('landing.pricing.calc.title')}</p>
                    <div className="flex items-center gap-3 mb-2">
                        <input
                            type="range"
                            min={6}
                            max={100}
                            value={users}
                            onChange={(e) => setUsers(Number(e.target.value))}
                            className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer accent-emerald-500 bg-zinc-200 dark:bg-white/10"
                        />
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                            <input
                                type="number"
                                min={6}
                                max={100}
                                value={users}
                                onChange={(e) => {
                                    const v = Math.max(6, Math.min(100, Number(e.target.value) || 6));
                                    setUsers(v);
                                }}
                                className="w-14 px-2 py-1 text-center font-bold text-primary text-sm bg-background border border-zinc-200 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                            />
                            <span className="text-xs text-tertiary">users</span>
                        </div>
                    </div>
                    <div className="flex justify-between text-xs text-tertiary">
                        <span>6</span>
                        <span>100</span>
                    </div>
                </div>
            </div>

            {/* Results — replaces the features list */}
            <div className="flex-1 mb-8">
                {isFree ? (
                    <motion.div
                        key="free"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-center h-full py-4 text-emerald-500 font-medium text-sm text-center"
                    >
                        {t('landing.pricing.calc.free')}
                    </motion.div>
                ) : (
                    <motion.div
                        key="paid"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-3"
                    >
                        {/* Beta price — highlighted */}
                        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl px-4 py-3">
                            <div className="flex items-center justify-between mb-0.5">
                                <p className="text-xs font-semibold text-emerald-500">
                                    {t('landing.pricing.calc.betaLabel')}
                                </p>
                                <span className="text-xs text-amber-500 font-medium">
                                    {t('landing.pricing.calc.betaBilling')}
                                </span>
                            </div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-bold text-primary">{betaTotal}€</span>
                                <span className="text-xs text-tertiary">{t('landing.pricing.calc.perMonth')}</span>
                            </div>
                            <p className="text-xs text-emerald-500 font-medium mt-1">
                                {t('landing.pricing.calc.annualTotal', { amount: betaAnnual })}
                            </p>
                        </div>

                        {/* Post-beta + savings */}
                        <div className="space-y-2 px-1">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-tertiary line-through">{postBetaTotal}€ / mois</span>
                                <span className="text-xs text-tertiary/60">{t('landing.pricing.calc.postBetaLabel')}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <TrendingDown className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                                <span className="text-secondary text-xs">
                                    {t('landing.pricing.calc.savings', { amount: savings })}
                                </span>
                            </div>
                            <p className="text-xs text-tertiary">
                                {t('landing.pricing.calc.slackCompare', { amount: slackTotal })}
                            </p>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* CTA */}
            <motion.button
                onClick={() => openBetaModal()}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3.5 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 text-sm bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_0_30px_rgba(16,185,129,0.3)]"
            >
                {t('landing.pricing.calc.cardCta')}
                <ArrowRight className="w-4 h-4" />
            </motion.button>
        </motion.div>
    );
};

export const Pricing = () => {
    const { openBetaModal } = useBetaModal();
    const { t } = useTranslation();

    const freeFeatures = ['f1', 'f2', 'f3'];
    const paidFeatures = ['f1', 'f2', 'f3', 'f4', 'f5'];

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

                {/* 3-column plans grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 mb-12">

                    {/* Free plan */}
                    <FadeIn delay={0.1}>
                        <motion.div
                            whileHover={{ y: -6 }}
                            className="relative h-full p-6 sm:p-8 rounded-2xl bg-card/50 border border-zinc-200 dark:border-white/5 hover:border-zinc-300 dark:hover:border-white/10 transition-all duration-300 flex flex-col"
                        >
                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-1">
                                    <p className="text-lg font-bold text-primary">
                                        {t('landing.pricing.free.name')}
                                    </p>
                                    <span className="text-xs text-tertiary bg-zinc-100 dark:bg-white/5 px-2 py-1 rounded-full">
                                        {t('landing.pricing.free.members')}
                                    </span>
                                </div>
                                <div className="mt-4">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-4xl sm:text-5xl font-bold text-primary">0</span>
                                        <span className="text-base text-tertiary">€</span>
                                    </div>
                                    <p className="text-sm text-secondary mt-1">
                                        {t('landing.pricing.free.forever')}
                                    </p>
                                </div>
                            </div>

                            <ul className="space-y-3 mb-8 flex-1">
                                {freeFeatures.map((fk) => (
                                    <li key={fk} className="flex items-center gap-2.5">
                                        <Check className="w-4 h-4 flex-shrink-0 text-emerald-500/60" />
                                        <span className="text-sm text-secondary">
                                            {t(`landing.pricing.free.${fk}`)}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            <div className="w-full py-3.5 rounded-xl font-medium text-sm bg-zinc-100 dark:bg-white/5 text-tertiary border border-zinc-200 dark:border-white/10 flex items-center justify-center gap-2 cursor-not-allowed">
                                <Clock className="w-4 h-4" />
                                {t('landing.pricing.free.cta')}
                            </div>
                        </motion.div>
                    </FadeIn>

                    {/* Founding Member plan */}
                    <FadeIn delay={0.2}>
                        <motion.div
                            whileHover={{ y: -6 }}
                            className="relative h-full p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-emerald-500/10 via-emerald-500/5 to-transparent border-2 border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.15)] transition-all duration-300 flex flex-col"
                        >
                            {/* Badge */}
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-amber-500 to-amber-600 text-black text-xs font-bold rounded-full shadow-lg whitespace-nowrap">
                                {t('landing.pricing.paid.badge')}
                            </div>

                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-1">
                                    <p className="text-lg font-bold text-emerald-500">
                                        {t('landing.pricing.paid.name')}
                                    </p>
                                    <span className="text-xs text-tertiary bg-zinc-100 dark:bg-white/5 px-2 py-1 rounded-full">
                                        {t('landing.pricing.paid.members')}
                                    </span>
                                </div>
                                    <div className="mt-4">
                                        <p className="text-sm text-tertiary line-through mb-1">
                                            {t('landing.pricing.paid.originalPrice')}
                                        </p>
                                        <div className="flex items-baseline gap-1 flex-wrap">
                                            <span className="text-4xl sm:text-5xl font-bold text-primary">
                                                {t('landing.pricing.paid.price')}
                                            </span>
                                            <span className="text-sm text-tertiary leading-tight">
                                                {t('landing.pricing.paid.period')}
                                            </span>
                                        </div>
                                        <p className="text-xs text-amber-500 font-medium mt-1.5">
                                            {t('landing.pricing.paid.billingNote')}
                                        </p>
                                        <p className="text-xs text-emerald-500/80 mt-0.5">
                                            {t('landing.pricing.paid.annualNote')}
                                        </p>
                                    </div>
                            </div>

                            <ul className="space-y-3 mb-8 flex-1">
                                {paidFeatures.map((fk) => (
                                    <li key={fk} className="flex items-center gap-2.5">
                                        <Check className="w-4 h-4 flex-shrink-0 text-emerald-500" />
                                        <span className="text-sm text-secondary">
                                            {t(`landing.pricing.paid.${fk}`)}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            <motion.button
                                onClick={() => openBetaModal()}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full py-3.5 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 text-sm bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_0_30px_rgba(16,185,129,0.3)]"
                            >
                                {t('landing.pricing.paid.cta')}
                                <ArrowRight className="w-4 h-4" />
                            </motion.button>
                        </motion.div>
                    </FadeIn>

                    {/* Calculator card */}
                    <FadeIn delay={0.3}>
                        <PricingCalculatorCard />
                    </FadeIn>
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
                    <div className="pt-8 border-t border-zinc-200 dark:border-white/5">
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
