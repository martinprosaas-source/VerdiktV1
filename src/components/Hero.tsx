import { ArrowRight, ChevronDown, Volume2, VolumeX } from 'lucide-react';
import { Section, FadeIn } from './ui/Section';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef } from 'react';

export const Hero = () => {
    const [isMuted, setIsMuted] = useState(true);
    const videoRef = useRef<HTMLVideoElement>(null);

    const handleUnmute = () => {
        if (videoRef.current) {
            videoRef.current.muted = false;
            videoRef.current.currentTime = 0;
            videoRef.current.play();
            setIsMuted(false);
        }
    };

    return (
        <Section className="relative min-h-screen flex items-center justify-center pt-32 pb-20 overflow-hidden bg-background transition-colors duration-300">
            {/* Background elements */}
            <div className="absolute inset-0">
                {/* Gradient orbs */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-emerald-500/[0.08] rounded-full blur-[120px]" />
                <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-emerald-400/[0.05] rounded-full blur-[100px]" />
                
                {/* Grid pattern - like app */}
                <div 
                    className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.04)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:48px_48px]"
                    style={{
                        maskImage: 'radial-gradient(ellipse 80% 70% at 50% 30%, black 20%, transparent 80%)',
                        WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at 50% 30%, black 20%, transparent 80%)'
                    }}
                />
                
                {/* Bottom fade */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
                {/* Badge */}
                <FadeIn>
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-center mb-8"
                    >
                        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-xs sm:text-sm font-medium text-emerald-500">Beta ouverte — 75 places max</span>
                        </div>
                    </motion.div>
                </FadeIn>

                {/* Main headline */}
                <FadeIn delay={0.1}>
                    <div className="text-center mb-8">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold tracking-tight leading-[0.95]">
                            <span className="text-tertiary">Arrêtez de débattre.</span>
                            <br />
                            <span className="text-primary">Commencez à </span>
                            <span className="relative inline-block">
                                <span className="text-emerald-500">décider</span>
                                <svg className="absolute -bottom-1 sm:-bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none">
                                    <path d="M2 6C50 2 150 2 198 6" stroke="rgb(16 185 129)" strokeWidth="3" strokeLinecap="round"/>
                                </svg>
                            </span>
                            <span className="text-primary">.</span>
                        </h1>
                    </div>
                </FadeIn>

                {/* Subtitle */}
                <FadeIn delay={0.2}>
                    <p className="text-center text-lg sm:text-xl text-secondary max-w-2xl mx-auto mb-12 leading-relaxed">
                        Verdikt structure vos décisions d'équipe, collecte les avis de chacun,
                        et vous donne une recommandation claire. <span className="text-primary font-medium">Sans réunion de 2h</span>.
                    </p>
                </FadeIn>

                {/* CTAs */}
                <FadeIn delay={0.3}>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                        <motion.button
                            onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="group relative w-full sm:w-auto px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-full transition-all duration-300 shadow-[0_0_40px_rgba(16,185,129,0.3)] hover:shadow-[0_0_60px_rgba(16,185,129,0.4)]"
                        >
                            <span className="flex items-center justify-center gap-2">
                                Rejoindre la beta
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </motion.button>
                        
                        <motion.button
                            onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="group w-full sm:w-auto px-8 py-4 bg-transparent hover:bg-zinc-100 dark:hover:bg-white/5 text-primary font-medium rounded-full border border-zinc-200 dark:border-white/10 hover:border-zinc-300 dark:hover:border-white/20 transition-all duration-300"
                        >
                            <span className="flex items-center justify-center gap-2">
                                <ChevronDown className="w-4 h-4" />
                                Comment ça marche ?
                            </span>
                        </motion.button>
                    </div>
                </FadeIn>

                {/* Video Section */}
                <FadeIn delay={0.4}>
                    <div className="relative max-w-4xl mx-auto mb-8">
                        {/* Post-it note - top right outside video */}
                        <motion.div
                            initial={{ opacity: 0, y: -100, rotate: -15 }}
                            animate={{ opacity: 1, y: 0, rotate: 4 }}
                            transition={{ 
                                delay: 0.6,
                                type: "spring", 
                                stiffness: 300,
                                damping: 15,
                                mass: 1
                            }}
                            className="absolute -top-14 -right-4 sm:-right-12 lg:-right-20 z-20 hidden sm:block"
                        >
                            <div 
                                className="relative bg-emerald-400 px-5 py-3.5 rounded-sm shadow-xl"
                                style={{
                                    boxShadow: '3px 5px 15px rgba(0,0,0,0.2)',
                                }}
                            >
                                {/* Tape effect */}
                                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-10 h-4 bg-white/40 rounded-sm" />
                                <p className="text-base font-semibold text-emerald-950 whitespace-nowrap" style={{ fontFamily: "'Caveat', cursive", fontSize: '18px' }}>
                                    Plus court qu'une réunion 😉
                                </p>
                            </div>
                        </motion.div>

                        {/* Glow effect */}
                        <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/20 via-emerald-500/10 to-emerald-500/20 rounded-3xl blur-3xl opacity-40" />
                        
                        {/* Video container */}
                        <motion.div
                            whileHover={{ scale: 1.01 }}
                            className="relative rounded-2xl overflow-hidden border border-zinc-200 dark:border-white/10 bg-card shadow-2xl"
                        >
                            <video 
                                ref={videoRef}
                                src="/Verdikt Preview 2.mp4"
                                className="w-full aspect-video"
                                autoPlay
                                muted
                                loop
                                playsInline
                            />

                            {/* Sound button overlay */}
                            <AnimatePresence>
                                {isMuted && (
                                    <motion.button
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        onClick={handleUnmute}
                                        className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2.5 bg-zinc-900/80 hover:bg-zinc-900 backdrop-blur-sm rounded-full border border-white/10 transition-colors cursor-pointer group"
                                    >
                                        <Volume2 className="w-4 h-4 text-white" />
                                        <span className="text-sm font-medium text-white">Cliquez pour le son</span>
                                        <motion.div
                                            animate={{ scale: [1, 1.2, 1] }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                            className="w-2 h-2 rounded-full bg-emerald-500"
                                        />
                                    </motion.button>
                                )}
                            </AnimatePresence>

                            {/* Muted indicator when sound is on */}
                            {!isMuted && (
                                <button
                                    onClick={() => {
                                        if (videoRef.current) {
                                            videoRef.current.muted = true;
                                            setIsMuted(true);
                                        }
                                    }}
                                    className="absolute top-4 right-4 p-2.5 bg-zinc-900/60 hover:bg-zinc-900/80 backdrop-blur-sm rounded-full border border-white/10 transition-colors cursor-pointer"
                                >
                                    <VolumeX className="w-4 h-4 text-white" />
                                </button>
                            )}
                        </motion.div>

                    </div>
                </FadeIn>

            </div>

            {/* Scroll indicator */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2"
            >
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-6 h-10 rounded-full border-2 border-zinc-300 dark:border-white/20 flex justify-center pt-2"
                >
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                </motion.div>
            </motion.div>
        </Section>
    );
};
