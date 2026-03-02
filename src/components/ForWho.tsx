import { Section, FadeIn } from './ui/Section';
import { motion } from 'framer-motion';

const painPoints = [
    {
        number: '01',
        text: 'Vos décisions prennent des semaines au lieu de jours',
    },
    {
        number: '02',
        text: 'Vos réunions finissent par "on en reparle"',
    },
    {
        number: '03',
        text: 'Personne ne sait qui a décidé quoi (et pourquoi)',
    },
    {
        number: '04',
        text: 'Les mêmes débats reviennent tous les 6 mois',
    },
    {
        number: '05',
        text: 'Les voix fortes dominent, les autres se taisent',
    },
];

export const ForWho = () => {
    return (
        <Section className="py-32 sm:py-44 bg-background relative overflow-hidden transition-colors duration-300">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                {/* Header - minimal */}
                <FadeIn className="mb-16 sm:mb-24">
                    <p className="text-emerald-500 font-mono text-sm tracking-wider mb-4 uppercase">Pour qui</p>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary leading-[1.1] tracking-tight">
                        Verdikt est fait pour vous si...
                    </h2>
                </FadeIn>

                {/* Pain points - clean list */}
                <div className="space-y-0">
                    {painPoints.map((point, index) => (
                        <FadeIn key={point.number} delay={0.1 + index * 0.08}>
                            <motion.div
                                whileHover={{ x: 8 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                                className="group py-6 sm:py-8 border-t border-zinc-200 dark:border-white/5 cursor-default"
                            >
                                <div className="flex items-start gap-4 sm:gap-6 md:gap-8">
                                    {/* Number */}
                                    <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-zinc-200 dark:text-white/5 group-hover:text-emerald-500/30 transition-colors duration-300 flex-shrink-0">
                                        {point.number}
                                        </span>

                                    {/* Arrow + Text */}
                                    <div className="flex items-center gap-3 sm:gap-4 pt-1 sm:pt-2">
                                        <span className="text-emerald-500 text-xl sm:text-2xl group-hover:translate-x-1 transition-transform duration-300">
                                            →
                                        </span>
                                        <p className="text-lg sm:text-xl md:text-2xl text-secondary group-hover:text-primary transition-colors duration-300 leading-snug">
                                            {point.text}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        </FadeIn>
                    ))}
                </div>

                {/* Bottom line */}
                <div className="border-t border-zinc-200 dark:border-white/5" />
            </div>
        </Section>
    );
};
