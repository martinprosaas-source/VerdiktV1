import { cn } from '../../../lib/utils';

interface BadgeProps {
    variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
    children: React.ReactNode;
    className?: string;
}

const variantStyles = {
    default: 'bg-white/10 text-secondary',
    success: 'bg-emerald-500/15 text-emerald-400',
    warning: 'bg-yellow-500/15 text-yellow-400',
    danger: 'bg-red-500/15 text-red-400',
    info: 'bg-blue-500/15 text-blue-400',
};

export const StatusBadge = ({ 
    variant = 'default', 
    children, 
    className 
}: BadgeProps) => {
    return (
        <span 
            className={cn(
                'inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium',
                variantStyles[variant],
                className
            )}
        >
            {children}
        </span>
    );
};

export const getStatusVariant = (status: 'active' | 'completed' | 'archived'): 'success' | 'info' | 'default' => {
    switch (status) {
        case 'active':
            return 'success';
        case 'completed':
            return 'info';
        case 'archived':
            return 'default';
        default:
            return 'default';
    }
};

export const getStatusLabel = (status: 'active' | 'completed' | 'archived'): string => {
    switch (status) {
        case 'active':
            return 'En cours';
        case 'completed':
            return 'Terminée';
        case 'archived':
            return 'Archivée';
        default:
            return status;
    }
};
