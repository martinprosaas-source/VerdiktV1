import { cn } from '../../../lib/utils';

interface ProgressProps {
    value: number;
    max?: number;
    showLabel?: boolean;
    size?: 'xs' | 'sm' | 'md';
    className?: string;
}

export const Progress = ({ 
    value, 
    max = 100, 
    showLabel = false,
    size = 'sm',
    className 
}: ProgressProps) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));
    
    const sizeStyles = {
        xs: 'h-1',
        sm: 'h-1.5',
        md: 'h-2',
    };

    return (
        <div className={cn('flex items-center gap-2', className)}>
            <div className={cn('flex-1 bg-white/10 rounded-full overflow-hidden', sizeStyles[size])}>
                <div 
                    className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                />
            </div>
            {showLabel && (
                <span className="text-[10px] text-tertiary font-medium">
                    {Math.round(percentage)}%
                </span>
            )}
        </div>
    );
};
