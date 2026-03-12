import { useState } from 'react';
import { Section, FadeIn } from './ui/Section';
import { Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface FAQItem {
    question: string;
    answer: React.ReactNode;
}

const faqsFR: FAQItem[] = [
    {
        question: "C'est quoi exactement Verdikt ?",
        answer: (
            <p>
                Verdikt, c'est un outil de décision d'équipe. Tu poses une question, ton équipe vote et argumente en async, et l'IA te donne une recommandation claire.{' '}
                <strong>Résultat : tu passes de "on en reparle lundi" à une décision actée en 15 minutes.</strong>
            </p>
        ),
    },
    {
        question: "En quoi c'est différent de Slack ou Notion ?",
        answer: (
            <div className="space-y-3">
                <p>Slack, c'est pour discuter. Notion, c'est pour documenter. <strong>Verdikt, c'est pour décider.</strong></p>
                <ul className="space-y-1.5">
                    <li className="flex items-start gap-2">
                        <span className="text-zinc-500 shrink-0 mt-0.5">→</span>
                        <span><strong>Slack</strong> — 50 messages, personne ne tranche.</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-zinc-500 shrink-0 mt-0.5">→</span>
                        <span><strong>Notion</strong> — Un doc que personne ne lit.</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-emerald-500 shrink-0 mt-0.5">→</span>
                        <span><strong>Verdikt</strong> — Une question, des votes, une décision.</span>
                    </li>
                </ul>
                <p>C'est pas un remplacement, c'est un complément. D'ailleurs, on s'intègre avec les deux.</p>
            </div>
        ),
    },
    {
        question: "Est-ce que ça remplace nos réunions ?",
        answer: (
            <div className="space-y-2">
                <p>Non. Ça remplace les <strong>mauvaises</strong> réunions. Celles qui tournent en rond pendant 2h sans jamais conclure.</p>
                <p>Les vraies discussions stratégiques restent humaines. Verdikt vous aide juste à arriver préparés — et à ne plus perdre 3 semaines sur des décisions qui auraient dû prendre 15 minutes.</p>
            </div>
        ),
    },
    {
        question: "Et si mon équipe ne l'utilise pas ?",
        answer: (
            <div className="space-y-2">
                <p>C'est la question qu'on s'est le plus posée en construisant Verdikt.</p>
                <p>Notre réponse : on a rendu l'outil aussi simple qu'un sondage. <strong>Pas de formation. Pas de manuel de 50 pages.</strong> Tu reçois un lien, tu votes, tu argumentes, c'est fini.</p>
                <p>Et avec les notifications Slack, ton équipe n'a même pas besoin d'ouvrir Verdikt pour participer.</p>
            </div>
        ),
    },
    {
        question: "Mes données sont-elles sécurisées ?",
        answer: (
            <div className="space-y-3">
                <p>Oui.</p>
                <ul className="space-y-1.5">
                    {[
                        'Hébergement sur Vercel et Supabase (les mêmes infras que des milliers de startups tech)',
                        'Chiffrement des données',
                        'Authentification sécurisée (Google ou email)',
                        'Données hébergées aux US, conformité RGPD pour les utilisateurs EU',
                    ].map((item) => (
                        <li key={item} className="flex items-start gap-2">
                            <span className="text-emerald-500 shrink-0 mt-1">✓</span>
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
                <p className="text-sm text-zinc-500">On n'est pas certifiés SOC2 ou ISO27001 (on est une startup early-stage), mais la sécurité est une priorité depuis le jour 1.</p>
            </div>
        ),
    },
    {
        question: "Ça s'intègre avec nos outils ?",
        answer: (
            <div className="space-y-3">
                <p>Oui. <strong>Slack, Notion, Google Calendar.</strong></p>
                <ul className="space-y-1.5">
                    <li className="flex items-start gap-2"><span className="text-emerald-500 shrink-0 mt-0.5">→</span><span><strong>Slack</strong> — notifications quand une décision est lancée, vote directement depuis Slack</span></li>
                    <li className="flex items-start gap-2"><span className="text-emerald-500 shrink-0 mt-0.5">→</span><span><strong>Notion</strong> — sync automatique de tes décisions</span></li>
                    <li className="flex items-start gap-2"><span className="text-emerald-500 shrink-0 mt-0.5">→</span><span><strong>Google Calendar</strong> — deadline visible dans ton agenda</span></li>
                </ul>
                <p>Verdikt s'adapte à vos outils. Pas l'inverse.</p>
            </div>
        ),
    },
    {
        question: "C'est quoi le prix ?",
        answer: (
            <div className="space-y-3">
                <p>On est en beta. <strong>75 places disponibles</strong> à tarif Founding Member :</p>
                <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-white/5 border border-white/8 p-4">
                        <p className="text-white font-semibold text-sm mb-1">Pro</p>
                        <p className="text-emerald-400 font-bold text-xl">790€<span className="text-sm font-normal text-zinc-400">/an</span></p>
                        <p className="text-xs text-zinc-500 mt-1">Jusqu'à 20 utilisateurs</p>
                    </div>
                    <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/20 p-4">
                        <p className="text-white font-semibold text-sm mb-1">Business</p>
                        <p className="text-emerald-400 font-bold text-xl">1 990€<span className="text-sm font-normal text-zinc-400">/an</span></p>
                        <p className="text-xs text-zinc-500 mt-1">Jusqu'à 50 utilisateurs</p>
                    </div>
                </div>
                <p className="text-sm text-zinc-400">C'est <strong>-33%</strong> par rapport au prix de lancement prévu. Et ce tarif est <strong>garanti à vie</strong> pour les membres beta.</p>
            </div>
        ),
    },
    {
        question: "Et si je veux annuler ?",
        answer: (
            <p>
                Tu annules quand tu veux. <strong>Pas d'engagement long terme, pas de piège, pas de "appelez notre service client".</strong>{' '}
                Si Verdikt t'aide pas, on veut pas te garder de force.
            </p>
        ),
    },
];

const faqsEN: FAQItem[] = [
    {
        question: "What exactly is Verdikt?",
        answer: (
            <p>
                Verdikt is a team decision tool. You ask a question, your team votes and argues async, and AI gives you a clear recommendation.{' '}
                <strong>Result: you go from "let's discuss Monday" to a final decision in 15 minutes.</strong>
            </p>
        ),
    },
    {
        question: "How is it different from Slack or Notion?",
        answer: (
            <div className="space-y-3">
                <p>Slack is for chatting. Notion is for documenting. <strong>Verdikt is for deciding.</strong></p>
                <ul className="space-y-1.5">
                    <li className="flex items-start gap-2">
                        <span className="text-zinc-500 shrink-0 mt-0.5">→</span>
                        <span><strong>Slack</strong> — 50 messages, no one decides.</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-zinc-500 shrink-0 mt-0.5">→</span>
                        <span><strong>Notion</strong> — A doc no one reads.</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-emerald-500 shrink-0 mt-0.5">→</span>
                        <span><strong>Verdikt</strong> — A question, votes, a decision.</span>
                    </li>
                </ul>
                <p>It's not a replacement, it's a complement. And yes, we integrate with both.</p>
            </div>
        ),
    },
    {
        question: "Does it replace our meetings?",
        answer: (
            <div className="space-y-2">
                <p>No. It replaces <strong>bad</strong> meetings. The ones that go in circles for 2 hours without ever concluding.</p>
                <p>Real strategic discussions stay human. Verdikt just helps you come prepared — and stop wasting 3 weeks on decisions that should take 15 minutes.</p>
            </div>
        ),
    },
    {
        question: "What if my team doesn't use it?",
        answer: (
            <div className="space-y-2">
                <p>That's the question we asked ourselves the most while building Verdikt.</p>
                <p>Our answer: we made it as simple as a poll. <strong>No training. No 50-page manual.</strong> You get a link, you vote, you argue, you're done.</p>
                <p>And with Slack notifications, your team doesn't even need to open Verdikt to participate.</p>
            </div>
        ),
    },
    {
        question: "Is my data secure?",
        answer: (
            <div className="space-y-3">
                <p>Yes.</p>
                <ul className="space-y-1.5">
                    {[
                        'Hosted on Vercel and Supabase (same infra as thousands of tech startups)',
                        'Data encryption',
                        'Secure authentication (Google or email)',
                        'Data hosted in US, GDPR compliant for EU users',
                    ].map((item) => (
                        <li key={item} className="flex items-start gap-2">
                            <span className="text-emerald-500 shrink-0 mt-1">✓</span>
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
                <p className="text-sm text-zinc-500">We're not SOC2 or ISO27001 certified (we're an early-stage startup), but security has been a priority since day 1.</p>
            </div>
        ),
    },
    {
        question: "Does it integrate with our tools?",
        answer: (
            <div className="space-y-3">
                <p>Yes. <strong>Slack, Notion, Google Calendar.</strong></p>
                <ul className="space-y-1.5">
                    <li className="flex items-start gap-2"><span className="text-emerald-500 shrink-0 mt-0.5">→</span><span><strong>Slack</strong> — notifications when a decision is launched, vote directly from Slack</span></li>
                    <li className="flex items-start gap-2"><span className="text-emerald-500 shrink-0 mt-0.5">→</span><span><strong>Notion</strong> — automatic sync of your decisions</span></li>
                    <li className="flex items-start gap-2"><span className="text-emerald-500 shrink-0 mt-0.5">→</span><span><strong>Google Calendar</strong> — deadline visible in your calendar</span></li>
                </ul>
                <p>Verdikt adapts to your tools. Not the other way around.</p>
            </div>
        ),
    },
    {
        question: "What's the price?",
        answer: (
            <div className="space-y-3">
                <p>We're in beta. <strong>75 spots available</strong> at Founding Member pricing:</p>
                <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-white/5 border border-white/8 p-4">
                        <p className="text-white font-semibold text-sm mb-1">Pro</p>
                        <p className="text-emerald-400 font-bold text-xl">€790<span className="text-sm font-normal text-zinc-400">/year</span></p>
                        <p className="text-xs text-zinc-500 mt-1">Up to 20 users</p>
                    </div>
                    <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/20 p-4">
                        <p className="text-white font-semibold text-sm mb-1">Business</p>
                        <p className="text-emerald-400 font-bold text-xl">€1,990<span className="text-sm font-normal text-zinc-400">/year</span></p>
                        <p className="text-xs text-zinc-500 mt-1">Up to 50 users</p>
                    </div>
                </div>
                <p className="text-sm text-zinc-400">That's <strong>-33%</strong> off our planned launch price. And this price is <strong>locked for life</strong> for beta members.</p>
            </div>
        ),
    },
    {
        question: "What if I want to cancel?",
        answer: (
            <p>
                You cancel whenever you want. <strong>No long-term commitment, no tricks, no "call our customer service".</strong>{' '}
                If Verdikt doesn't help you, we don't want to keep you.
            </p>
        ),
    },
];

export const FAQ = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const { t, i18n } = useTranslation();

    const faqs = i18n.language.startsWith('fr') ? faqsFR : faqsEN;

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
                        <FadeIn key={index} delay={0.04 * index}>
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
                                    <span className={`text-base sm:text-lg font-medium transition-colors ${openIndex === index ? 'text-emerald-500' : 'text-primary'}`}>
                                        {faq.question}
                                    </span>
                                    <div className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-colors ${openIndex === index ? 'bg-emerald-500 text-black' : 'bg-zinc-100 dark:bg-white/5 text-tertiary'}`}>
                                        {openIndex === index ? (
                                            <Minus className="w-4 h-4" />
                                        ) : (
                                            <Plus className="w-4 h-4" />
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
                                            <div className="px-6 sm:px-8 pb-6 sm:pb-8 text-sm sm:text-base text-secondary leading-relaxed [&_strong]:text-zinc-200 [&_strong]:font-semibold">
                                                {faq.answer}
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
                            <a href="mailto:contact@verdikt.dev" className="text-emerald-500 hover:underline">
                                contact@verdikt.dev
                            </a>
                        </p>
                    </div>
                </FadeIn>
            </div>
        </Section>
    );
};
