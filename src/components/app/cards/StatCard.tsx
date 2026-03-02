import type { LucideIcon } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface StatCardProps {
    label: string;
    value: number | string;
    icon: LucideIcon;
    className?: string;
}

export const StatCard = ({ label, value, icon: Icon, className }: StatCardProps) => {
    return (
        <div className={cn(
            'flex items-center gap-4 px-5 py-4 bg-card border border-zinc-200 dark:border-white/5 rounded-lg hover:border-zinc-300 dark:hover:border-white/10 transition-colors',
            className
        )}>
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-emerald-500" />
            </div>
            <div className="min-w-0">
                <div className="text-2xl font-semibold text-primary">{value}</div>
                <div className="text-xs text-tertiary truncate">{label}</div>
            </div>
        </div>
    );
};
