import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface StatCardProps {
    label: string;
    value: number | string;
    icon: LucideIcon;
    className?: string;
    index?: number;
}

function AnimatedNumber({ value }: { value: number }) {
    const [display, setDisplay] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (!isInView) return;
        if (value === 0) { setDisplay(0); return; }

        const duration = 600;
        const steps = Math.min(value, 30);
        const stepTime = duration / steps;
        let current = 0;

        const timer = setInterval(() => {
            current++;
            setDisplay(Math.round((current / steps) * value));
            if (current >= steps) clearInterval(timer);
        }, stepTime);

        return () => clearInterval(timer);
    }, [value, isInView]);

    return <span ref={ref}>{display}</span>;
}

export const StatCard = ({ label, value, icon: Icon, className, index = 0 }: StatCardProps) => {
    const isNumber = typeof value === 'number';

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
            className={cn(
                'flex items-center gap-4 px-5 py-4 bg-card border border-zinc-200 dark:border-white/5 rounded-lg hover:border-emerald-500/30 dark:hover:border-emerald-500/20 transition-colors cursor-default',
                className
            )}
        >
            <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 + 0.15, type: 'spring', stiffness: 200 }}
                className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0"
            >
                <Icon className="w-5 h-5 text-emerald-500" />
            </motion.div>
            <div className="min-w-0">
                <div className="text-2xl font-semibold text-primary tabular-nums">
                    {isNumber ? <AnimatedNumber value={value} /> : value}
                </div>
                <div className="text-xs text-tertiary truncate">{label}</div>
            </div>
        </motion.div>
    );
};
