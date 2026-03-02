import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface SplashScreenProps {
    children: React.ReactNode;
}

const loadingTexts = [
    'Arrêtez de débattre...',
    'Commencez à décider.',
];

export const SplashScreen = ({ children }: SplashScreenProps) => {
    const [isLoading, setIsLoading] = useState(true);
    const [textIndex, setTextIndex] = useState(0);

    useEffect(() => {
        // Change to second text after 1 second
        const textTimer = setTimeout(() => {
            setTextIndex(1);
        }, 1000);

        // Duration of splash screen
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2400);

        return () => {
            clearTimeout(timer);
            clearTimeout(textTimer);
        };
    }, []);

    return (
        <>
            <AnimatePresence mode="wait">
                {isLoading && (
                    <motion.div
                        key="splash"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4, ease: 'easeInOut' }}
                        className="fixed inset-0 z-[100] bg-background flex items-center justify-center"
                    >
                        {/* Background grid */}
                        <div 
                            className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:48px_48px]"
                            style={{
                                maskImage: 'radial-gradient(ellipse 60% 60% at 50% 50%, black 20%, transparent 70%)',
                                WebkitMaskImage: 'radial-gradient(ellipse 60% 60% at 50% 50%, black 20%, transparent 70%)'
                            }}
                        />

                        {/* Static background glow */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px]" />

                        {/* Logo animation */}
                        <div className="relative flex flex-col items-center gap-5">
                            
                            {/* Icon container with pulsing glow */}
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ 
                                    type: 'spring',
                                    stiffness: 200,
                                    damping: 15,
                                    mass: 1,
                                }}
                                className="relative"
                            >
                                {/* Pulsing glow ring */}
                                <motion.div
                                    className="absolute inset-0 rounded-full bg-emerald-500/20 blur-xl"
                                    animate={{
                                        scale: [1, 1.4, 1],
                                        opacity: [0.3, 0.6, 0.3],
                                    }}
                                    transition={{
                                        duration: 1.5,
                                        repeat: Infinity,
                                        ease: 'easeInOut',
                                    }}
                                    style={{ width: '100%', height: '100%' }}
                                />
                                
                                {/* Second glow layer */}
                                <motion.div
                                    className="absolute inset-0 rounded-full bg-emerald-400/10 blur-2xl"
                                    animate={{
                                        scale: [1.2, 1.8, 1.2],
                                        opacity: [0.2, 0.4, 0.2],
                                    }}
                                    transition={{
                                        duration: 1.5,
                                        repeat: Infinity,
                                        ease: 'easeInOut',
                                        delay: 0.2,
                                    }}
                                    style={{ width: '100%', height: '100%' }}
                                />

                                {/* Icon */}
                                <motion.div
                                    animate={{ 
                                        scale: [1, 1.03, 1],
                                    }}
                                    transition={{
                                        duration: 1.5,
                                        repeat: Infinity,
                                        ease: 'easeInOut',
                                    }}
                                    className="relative z-10"
                                >
                                    <img
                                        src="/signifiant FN verdikt.png"
                                        alt="Verdikt"
                                        className="w-24 h-24 object-contain dark:block hidden"
                                    />
                                    <img
                                        src="/Signifiant FB verdikt.png"
                                        alt="Verdikt"
                                        className="w-24 h-24 object-contain dark:hidden block"
                                    />
                                </motion.div>
                            </motion.div>

                            {/* Logo text with spring */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ 
                                    type: 'spring',
                                    stiffness: 150,
                                    damping: 12,
                                    delay: 0.2,
                                }}
                            >
                                <img
                                    src="/Logo FN verdikt.png"
                                    alt="Verdikt"
                                    className="h-12 object-contain dark:block hidden"
                                />
                                <img
                                    src="/logo FB verdikt.png"
                                    alt="Verdikt"
                                    className="h-12 object-contain dark:hidden block"
                                />
                            </motion.div>

                            {/* Loading bar */}
                            <motion.div
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: 128 }}
                                transition={{ 
                                    type: 'spring',
                                    stiffness: 100,
                                    damping: 15,
                                    delay: 0.4,
                                }}
                                className="h-1 bg-zinc-200 dark:bg-white/10 rounded-full overflow-hidden"
                            >
                                <motion.div
                                    initial={{ width: '0%' }}
                                    animate={{ width: '100%' }}
                                    transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
                                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
                                />
                            </motion.div>

                            {/* Animated text */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="h-5 flex items-center"
                            >
                                <AnimatePresence mode="wait">
                                    <motion.p
                                        key={textIndex}
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -5 }}
                                        transition={{ duration: 0.2 }}
                                        className="text-sm text-tertiary"
                                    >
                                        {loadingTexts[textIndex]}
                                    </motion.p>
                                </AnimatePresence>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main content */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isLoading ? 0 : 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
            >
                {children}
            </motion.div>
        </>
    );
};
