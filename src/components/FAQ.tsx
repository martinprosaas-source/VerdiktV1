import { useState } from 'react';
import { Section, FadeIn } from './ui/Section';
import { Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
    {
        question: 'Est-ce que ça remplace nos réunions ?',
        answer: 'Non, ça remplace les réunions inutiles. Celles qui tournent en rond pendant 2h sans jamais conclure. Les vraies discussions stratégiques restent humaines. Verdikt vous aide juste à arriver préparés.',
    },
    {
        question: 'Comment l\'IA génère-t-elle la synthèse ?',
        answer: 'Elle analyse les arguments de chaque votant, identifie les points de consensus et de friction, et propose une recommandation basée sur la majorité pondérée. Tout est transparent et traçable dans le Decision Log.',
    },
    {
        question: 'Mes données sont-elles sécurisées ?',
        answer: 'Oui. Hébergement EU (France), chiffrement end-to-end, conformité RGPD. Nous ne vendons jamais vos données et vous pouvez les exporter ou les supprimer à tout moment.',
    },
    {
        question: 'Combien de temps pour setup ?',
        answer: '30 secondes. Créez un compte, invitez votre équipe via un lien, lancez votre première décision. Pas de formation requise, l\'interface est conçue pour être immédiatement intuitive.',
    },
    {
        question: 'Et si je veux annuler ?',
        answer: 'Un clic depuis vos paramètres. Pas de frais cachés, pas de période d\'engagement, pas de dark patterns. Vos données vous appartiennent.',
    },
];

export const FAQ = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <Section className="py-28 sm:py-40 bg-card/50 dark:bg-[#0a0a0a] relative overflow-hidden transition-colors duration-300">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
                {/* Header */}
                <FadeIn className="mb-16 sm:mb-20">
                    <p className="text-emerald-500 font-mono text-sm tracking-wider mb-4">// FAQ</p>
                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary leading-[0.9] tracking-tight">
                        Questions
                        <br />
                        <span className="text-tertiary">fréquentes.</span>
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
                            Autre question ?{' '}
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
