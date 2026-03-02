import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    glow?: boolean;
}

export const Card = ({ children, className, glow = true }: CardProps) => {
    return (
        <div className={cn(
            "relative group p-6 rounded-2xl bg-card border border-border-subtle/10 dark:border-white/[0.05]",
            glow && "hover:border-emerald-500/20 hover:bg-emerald-500/[0.02] transition-all duration-500 ease-out",
            className
        )}>
            {/* Glow on hover */}
            {glow && (
                <div className="
          absolute -inset-px rounded-2xl
          bg-gradient-to-b from-emerald-500/10 to-transparent
          opacity-0 group-hover:opacity-100
          transition-opacity duration-500
          pointer-events-none
        " />
            )}

            {/* Content */}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
};
