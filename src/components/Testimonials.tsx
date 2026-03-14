import { useTranslation } from 'react-i18next';
import { Section, FadeIn } from './ui/Section';
import { motion } from 'framer-motion';
import { Linkedin } from 'lucide-react';

export const Testimonials = () => {
    const { t } = useTranslation();

    return (
        <Section className="py-20 sm:py-28 bg-card/50 dark:bg-[#0a0a0a] relative overflow-hidden transition-colors duration-300">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2" />

            <div className="max-w-3xl mx-auto px-4 sm:px-6 relative">
                <FadeIn>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center"
                    >
                        <span className="text-[80px] sm:text-[100px] text-emerald-500/10 font-serif leading-none select-none pointer-events-none">"</span>

                        <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary leading-tight tracking-tight -mt-8">
                            {t('landing.testimonials.quote1')}
                        </p>
                        <p className="text-lg sm:text-xl md:text-2xl text-secondary mt-3 leading-relaxed">
                            {t('landing.testimonials.quote2')}
                        </p>

                        <div className="flex items-center justify-center gap-3 mt-8 pt-6 border-t border-zinc-200 dark:border-white/5 max-w-xs mx-auto">
                            <img
                                src="/Photo Chevalier Martin.JPG"
                                alt="Martin Chevalier"
                                className="w-10 h-10 rounded-full object-cover"
                            />
                            <div className="text-left">
                                <p className="text-primary font-semibold text-sm">{t('landing.testimonials.founder')}</p>
                                <p className="text-tertiary text-xs">{t('landing.testimonials.founderRole')}</p>
                            </div>
                            <a
                                href="https://www.linkedin.com/in/martin-chevalier-43211a224/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-lg text-tertiary hover:text-[#0A66C2] hover:bg-[#0A66C2]/10 transition-colors"
                                aria-label="LinkedIn de Martin Chevalier"
                            >
                                <Linkedin className="w-4 h-4" />
                            </a>
                        </div>
                    </motion.div>
                </FadeIn>
            </div>
        </Section>
    );
};
