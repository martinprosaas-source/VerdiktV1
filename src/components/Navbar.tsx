import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ModeToggle } from './ModeToggle';
import { ArrowRight } from 'lucide-react';
import { Logo } from './Logo';

export const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <motion.nav 
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 py-4"
        >
            {/* Compact floating pill navbar */}
            <motion.div 
                className={`
                    relative flex items-center gap-6 px-3 py-2
                    rounded-full transition-all duration-500
                    ${scrolled 
                        ? 'bg-white/90 dark:bg-zinc-900/90 shadow-lg shadow-black/5 dark:shadow-black/20 border border-zinc-200/50 dark:border-white/10' 
                        : 'bg-white/60 dark:bg-white/5 border border-zinc-200/30 dark:border-white/5'
                    }
                    backdrop-blur-xl
                `}
            >

                {/* Logo */}
                <Logo size="sm" linkTo="/" />

                {/* Divider */}
                <div className="w-px h-5 bg-zinc-300 dark:bg-white/10" />

                {/* Actions */}
                <div className="flex items-center gap-1">
                    <ModeToggle />
                    
                    <Link 
                        to="/login"
                        className="hidden sm:block px-3 py-1.5 text-sm font-medium text-secondary hover:text-primary transition-colors rounded-full hover:bg-zinc-100 dark:hover:bg-white/5"
                    >
                        Connexion
                    </Link>
                    
                    {/* CTA Button */}
                    <Link to="/signup">
                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="group relative flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium text-white rounded-full overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-300" />
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            
                            <span className="relative">Rejoindre</span>
                            <ArrowRight className="relative w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                        </motion.button>
                    </Link>
                </div>
            </motion.div>
        </motion.nav>
    );
};
