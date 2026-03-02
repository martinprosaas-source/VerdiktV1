import { Section, FadeIn } from './ui/Section';
import { GitPullRequest, Clock, Zap, ScrollText, Puzzle, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { SlackLogo, NotionLogo, GoogleCalendarLogo } from './icons/IntegrationLogos';

export const Features = () => {
    return (
        <Section id="features" className="py-28 sm:py-40 bg-card/50 dark:bg-[#0a0a0a] relative overflow-hidden transition-colors duration-300">
            {/* Background grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
            
            <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
                {/* Header */}
                <FadeIn className="mb-16 sm:mb-20">
                    <p className="text-emerald-500 font-mono text-sm tracking-wider mb-4">// FONCTIONNALITÉS</p>
                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary leading-[0.95] tracking-tight max-w-3xl">
                        Tout pour décider
                        <br />
                        <span className="text-tertiary">vite et bien.</span>
                    </h2>
                </FadeIn>

                {/* Bento Grid - Clean 6 column layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4 auto-rows-auto md:auto-rows-[minmax(180px,auto)]">
                    
                    {/* Card 1 - Structuration IA (Hero card) */}
                    <FadeIn delay={0.1} className="sm:col-span-2 md:col-span-4 md:row-span-2">
                        <motion.div
                            whileHover={{ y: -4 }}
                            className="group relative h-full p-8 rounded-3xl bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300 overflow-hidden"
                        >
                            <div className="relative z-10 h-full flex flex-col">
                                <div className="w-12 h-12 mb-5 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                                    <GitPullRequest className="w-6 h-6 text-emerald-500" />
                                </div>
                                <h3 className="text-2xl sm:text-3xl font-bold text-primary mb-3">
                                    Structuration <span className="text-emerald-500">intelligente</span>
                                </h3>
                                <p className="text-base text-secondary leading-relaxed mb-6 max-w-lg">
                                    Verdikt transforme vos questions floues en décisions structurées. Contexte, options, critères. Tout est clarifié avant de commencer.
                                </p>
                                
                                {/* Terminal mockup */}
                                <div className="mt-auto">
                                    <div className="relative bg-zinc-900 rounded-xl border border-zinc-800 p-3 sm:p-4">
                                        <div className="flex items-center gap-1.5 mb-2 sm:mb-3">
                                            <div className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-red-500/70" />
                                            <div className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-yellow-500/70" />
                                            <div className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-green-500/70" />
                                        </div>
                                        <div className="space-y-1 sm:space-y-1.5 text-[10px] sm:text-xs font-mono overflow-x-auto">
                                            <p className="text-zinc-500">// Question</p>
                                            <p className="text-white">"On augmente les prix ?"</p>
                                            <p className="text-zinc-500 mt-2">// Structuration IA</p>
                                            <p className="text-emerald-400">→ Contexte: inflation +12%</p>
                                            <p className="text-emerald-400">→ Options: +10%, +15%, +20%</p>
                                            <p className="text-emerald-400">→ Critères: marge, churn</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Glow */}
                            <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        </motion.div>
                    </FadeIn>

                    {/* Card 2 - Vote Async */}
                    <FadeIn delay={0.15} className="md:col-span-2">
                        <motion.div
                            whileHover={{ y: -4 }}
                            className="group h-full p-6 rounded-2xl bg-card border border-zinc-200 dark:border-white/5 hover:border-emerald-500/30 transition-all duration-300"
                        >
                            <Clock className="w-8 h-8 text-emerald-500 mb-4" />
                            <h3 className="text-lg font-bold text-primary mb-2">Vote asynchrone</h3>
                            <p className="text-sm text-secondary leading-relaxed">
                                Chacun vote quand il peut. Fini les Doodle interminables.
                            </p>
                        </motion.div>
                    </FadeIn>

                    {/* Card 3 - Synthèse */}
                    <FadeIn delay={0.2} className="md:col-span-2">
                        <motion.div
                            whileHover={{ y: -4 }}
                            className="group h-full p-6 rounded-2xl bg-card border border-zinc-200 dark:border-white/5 hover:border-emerald-500/30 transition-all duration-300"
                        >
                            <Zap className="w-8 h-8 text-emerald-500 mb-4" />
                            <h3 className="text-lg font-bold text-primary mb-2">Synthèse temps réel</h3>
                            <p className="text-sm text-secondary leading-relaxed">
                                Consensus et frictions identifiés. Recommandation automatique.
                            </p>
                        </motion.div>
                    </FadeIn>

                    {/* Card 4 - Decision Log */}
                    <FadeIn delay={0.25} className="md:col-span-3">
                        <motion.div
                            whileHover={{ y: -4 }}
                            className="group h-full p-6 rounded-2xl bg-card border border-zinc-200 dark:border-white/5 hover:border-emerald-500/30 transition-all duration-300"
                        >
                            <div className="flex items-start gap-5">
                                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                                    <ScrollText className="w-6 h-6 text-emerald-500" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-primary mb-2">Decision Log</h3>
                                    <p className="text-sm text-secondary leading-relaxed">
                                        Dans 6 mois, vous saurez pourquoi cette décision a été prise et qui l'a validée. Terminé le "on avait décidé quoi ?"
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </FadeIn>

                    {/* Card 5 - Intégrations */}
                    <FadeIn delay={0.3} className="md:col-span-3">
                        <motion.div
                            whileHover={{ y: -4 }}
                            className="group h-full p-6 rounded-2xl bg-card border border-zinc-200 dark:border-white/5 hover:border-emerald-500/30 transition-all duration-300"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <Puzzle className="w-8 h-8 text-emerald-500 mb-4" />
                                    <h3 className="text-lg font-bold text-primary mb-2">Intégrations natives</h3>
                                    <p className="text-sm text-secondary leading-relaxed">
                                        Slack, Notion, Google Calendar. Là où vous êtes déjà.
                                    </p>
                                </div>
                                <div className="flex flex-col items-center gap-2">
                                    <div className="flex gap-2">
                                        <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-white/10 flex items-center justify-center p-2">
                                            <SlackLogo className="w-full h-full object-contain" />
                                        </div>
                                        <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-white/10 flex items-center justify-center p-2">
                                            <NotionLogo className="w-full h-full object-contain" />
                                        </div>
                                    </div>
                                    <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-white/10 flex items-center justify-center p-2">
                                        <GoogleCalendarLogo className="w-full h-full object-contain" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </FadeIn>

                    {/* Card 6 - Sécurité (Full width accent) */}
                    <FadeIn delay={0.35} className="md:col-span-6">
                        <motion.div
                            whileHover={{ y: -2 }}
                            className="group p-6 rounded-2xl bg-gradient-to-r from-emerald-500/5 via-transparent to-emerald-500/5 border border-emerald-500/10 hover:border-emerald-500/20 transition-all duration-300"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                                        <Shield className="w-5 h-5 text-emerald-500" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-primary">Sécurité & Conformité</h3>
                                        <p className="text-sm text-secondary">
                                            Hébergement EU • Chiffrement • RGPD compliant
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </FadeIn>

                </div>
            </div>
        </Section>
    );
};
