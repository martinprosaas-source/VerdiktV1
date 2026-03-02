import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface SectionProps {
    children: React.ReactNode;
    className?: string;
    id?: string;
    delay?: number;
}

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1
        }
    }
};

export const Section = ({ children, className, id }: SectionProps) => {
    return (
        <motion.section
            id={id}
            className={cn("relative", className)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={container}
        >
            {children}
        </motion.section>
    );
};

export const FadeIn = ({ children, className, delay = 0 }: SectionProps) => {
    const item = {
        hidden: { opacity: 0, y: 20 },
        show: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: [0.25, 0.4, 0.25, 1] as any,
                delay: delay
            }
        }
    };

    return (
        <motion.div variants={item} className={className}>
            {children}
        </motion.div>
    );
};
