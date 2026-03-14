import { Section, FadeIn } from './ui/Section';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const CTA = () => {

    return (
        <Section className="py-28 sm:py-40 bg-background relative overflow-hidden transition-colors duration-300">
            {/* Background elements - orbs only */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-emerald-500/[0.08] rounded-full blur-[120px]" />
                <div className="absolute top-1/4 right-1/4 w-[350px] h-[350px] bg-emerald-400/[0.06] rounded-full blur-[100px]" />
                <div className="absolute bottom-1/4 left-1/4 w-[250px] h-[250px] bg-emerald-300/[0.04] rounded-full blur-[80px]" />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
                <FadeIn>
                    <div className="text-center">
                        {/* Badge */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-8"
                        >
                            <img src="/signifiant FN verdikt.png" alt="Verdikt" className="w-5 h-5 object-contain dark:block hidden" />
                            <img src="/Signifiant FB verdikt.png" alt="Verdikt" className="w-5 h-5 object-contain dark:hidden block" />
                            <span className="text-sm font-medium text-emerald-500">75 places Founding Member</span>
                        </motion.div>

                        {/* Headline */}
                        <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-primary leading-[0.95] tracking-tight mb-6">
                            Prêt à décider
                            <br />
                            <span className="text-tertiary">plus vite ?</span>
                        </h2>

                        {/* Subtitle */}
                        <p className="text-lg sm:text-xl text-secondary mb-10 max-w-2xl mx-auto">
                            Faites partie des 75 premiers à transformer vos réunions en décisions.
                        </p>

                        {/* CTA button */}
                        <motion.button
                            onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="group inline-flex items-center gap-2 px-10 py-5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-lg rounded-full transition-all duration-300 shadow-[0_0_50px_rgba(16,185,129,0.3)] hover:shadow-[0_0_70px_rgba(16,185,129,0.4)]"
                        >
                            Réserver un call de 20 min
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </motion.button>

                        {/* Trust badges */}
                        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-tertiary">
                            <span>✓ Prix garanti à vie</span>
                            <span className="hidden sm:inline">•</span>
                            <span>✓ Accès Premium</span>
                            <span className="hidden sm:inline">•</span>
                            <span>✓ Setup en 30 sec</span>
                        </div>
                    </div>
                </FadeIn>
            </div>
        </Section>
    );
};
