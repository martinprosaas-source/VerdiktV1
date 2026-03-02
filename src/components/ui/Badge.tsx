import React from 'react';
import { cn } from '../../lib/utils';
import { FadeIn } from './Section';

interface BadgeProps {
    children: React.ReactNode;
    className?: string;
}

export const Badge = ({ children, className }: BadgeProps) => {
    return (
        <FadeIn>
            <div className={cn(
                "inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full",
                className
            )}>
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                </span>
                {children}
            </div>
        </FadeIn>
    );
};
