import { Section, FadeIn } from './ui/Section';
import { motion } from 'framer-motion';
import { Linkedin } from 'lucide-react';

export const Testimonials = () => {
    return (
        <Section className="py-28 sm:py-40 bg-card/50 dark:bg-[#0a0a0a] relative overflow-hidden transition-colors duration-300">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/3 rounded-full blur-3xl translate-y-1/2" />
            
            <div className="max-w-4xl mx-auto px-4 sm:px-6 relative">
                {/* Header */}
                <FadeIn className="mb-12 sm:mb-16 text-center">
                    <p className="text-emerald-500 font-mono text-sm tracking-wider mb-4">// POURQUOI VERDIKT ?</p>
                </FadeIn>

                {/* Founder Story Card */}
                <FadeIn delay={0.1}>
                            <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="relative"
                            >
                                    {/* Quote mark */}
                        <span className="absolute -top-6 -left-2 sm:-left-4 text-[80px] sm:text-[120px] text-emerald-500/5 font-serif leading-none select-none pointer-events-none">"</span>
                                    
                        <div className="relative p-6 sm:p-8 md:p-10 rounded-2xl bg-gradient-to-br from-card via-card to-emerald-500/5 border border-zinc-200 dark:border-white/5">
                            {/* Story content */}
                            <div className="relative z-10 space-y-4 sm:space-y-5">
                                <p className="text-base sm:text-lg md:text-xl text-primary leading-relaxed font-medium">
                                    J'ai fondé une agence marketing. 7 personnes, des clients, de la croissance. 
                                    <span className="text-secondary"> Sur le papier, tout allait bien.</span>
                                </p>
                                
                                <p className="text-base sm:text-lg md:text-xl text-secondary leading-relaxed">
                                    Mais en interne, c'était autre chose.
                                </p>
                                
                                <p className="text-sm sm:text-base md:text-lg text-secondary leading-relaxed">
                                    Chaque décision prenait des semaines. 
                                    <span className="text-tertiary italic"> "On verra ça lundi." "On en reparle après le projet X." "On a le temps."</span>
                                </p>
                                
                                <p className="text-base sm:text-lg md:text-xl leading-relaxed">
                                    <span className="text-primary font-semibold">On n'avait jamais le temps.</span>
                                    <span className="text-secondary"> On a perdu des clients. On a raté des opportunités. </span>
                                    <span className="text-primary font-semibold">On a failli s'épuiser.</span>
                                </p>
                                
                                <div className="pt-3 sm:pt-4 border-t border-zinc-200 dark:border-white/5">
                                    <p className="text-sm sm:text-base md:text-lg text-secondary leading-relaxed mb-2">
                                        Aujourd'hui, le monde va vite.
                                    </p>
                                    <p className="text-base sm:text-lg md:text-xl text-primary font-semibold leading-relaxed">
                                        Les équipes qui décident vite, <span className="text-emerald-500">gagnent.</span>
                                        <span className="text-secondary font-normal"> Les autres regardent passer le train.</span>
                                    </p>
                </div>

                                <p className="text-base sm:text-lg md:text-xl text-primary leading-relaxed pt-2">
                                    Verdikt, c'est l'outil que <span className="text-emerald-500 font-semibold">j'aurais voulu avoir</span> à l'époque.
                                </p>
                            </div>
                            
                            {/* Signature */}
                            <div className="flex items-center gap-3 mt-6 sm:mt-8 pt-5 border-t border-zinc-200 dark:border-white/5">
                                <img 
                                    src="/Photo Chevalier Martin.JPG" 
                                    alt="Martin Chevalier"
                                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover"
                                />
                                <div className="flex-1">
                                    <p className="text-primary font-semibold text-base sm:text-lg">Martin Chevalier</p>
                                    <p className="text-tertiary text-xs sm:text-sm">Fondateur de Verdikt</p>
                            </div>
                                <a 
                                    href="https://www.linkedin.com/in/martin-chevalier-43211a224/" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="p-2 rounded-lg text-tertiary hover:text-[#0A66C2] hover:bg-[#0A66C2]/10 transition-colors"
                                    aria-label="LinkedIn de Martin Chevalier"
                                >
                                    <Linkedin className="w-5 h-5" />
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </FadeIn>
            </div>
        </Section>
    );
};
