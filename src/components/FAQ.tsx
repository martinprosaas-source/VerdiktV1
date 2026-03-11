import { useState } from 'react';
import { Section, FadeIn } from './ui/Section';
import { Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export const FAQ = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const { t } = useTranslation();

    const faqs = [
        { question: t('landing.faq.q1'), answer: t('landing.faq.a1') },
        { question: t('landing.faq.q2'), answer: t('landing.faq.a2') },
        { question: t('landing.faq.q3'), answer: t('landing.faq.a3') },
        { question: t('landing.faq.q4'), answer: t('landing.faq.a4') },
        { question: t('landing.faq.q5'), answer: t('landing.faq.a5') },
    ];

    return (
        <Section className="py-28 sm:py-40 bg-card/50 dark:bg-[#0a0a0a] relative overflow-hidden transition-colors duration-300">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
                {/* Header */}
                <FadeIn className="mb-16 sm:mb-20">
                    <p className="text-emerald-500 font-mono text-sm tracking-wider mb-4">{t('landing.faq.label')}</p>
                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary leading-[0.9] tracking-tight">
                        {t('landing.faq.title').split('\n')[0]}
                        <br />
                        <span className="text-tertiary">{t('landing.faq.title').split('\n')[1] || ''}</span>
                    </h2>
                </FadeIn>

                {/* FAQ items */}
                <div className="space-y-2">
                    {faqs.map((faq, index) => (
                        <FadeIn key={index} delay={0.05 * index}>
                            <motion.div
                                className={`
                                    rounded-2xl overflow-hidden transition-all duration-300
                                    ${openIndex === index 
                                        ? 'bg-emerald-500/5 border border-emerald-500/20' 
                                        : 'bg-card/50 border border-zinc-200 dark:border-white/5 hover:border-zinc-300 dark:hover:border-white/10'
                                    }
                                `}
                            >
                                <button
                                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                    className="w-full p-6 sm:p-8 flex items-center justify-between gap-4 text-left"
                                >
                                    <span className={`text-lg sm:text-xl font-medium transition-colors ${openIndex === index ? 'text-emerald-500' : 'text-primary'}`}>
                                        {faq.question}
                                    </span>
                                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors ${openIndex === index ? 'bg-emerald-500 text-black' : 'bg-zinc-100 dark:bg-white/5 text-tertiary'}`}>
                                        {openIndex === index ? (
                                            <Minus className="w-5 h-5" />
                                        ) : (
                                            <Plus className="w-5 h-5" />
                                        )}
                                    </div>
                                </button>
                                
                                <AnimatePresence>
                                    {openIndex === index && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                        >
                                            <div className="px-6 sm:px-8 pb-6 sm:pb-8">
                                                <p className="text-base sm:text-lg text-secondary leading-relaxed">
                                                    {faq.answer}
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </FadeIn>
                    ))}
                </div>

                {/* Contact CTA */}
                <FadeIn delay={0.3}>
                    <div className="mt-12 text-center">
                        <p className="text-tertiary">
                            {t('landing.faq.other')}{' '}
                            <a href="mailto:hello@verdikt.ai" className="text-emerald-500 hover:underline">
                                hello@verdikt.ai
                            </a>
                        </p>
                    </div>
                </FadeIn>
            </div>
        </Section>
    );
};
