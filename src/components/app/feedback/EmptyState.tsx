import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    action?: ReactNode;
}

export const EmptyState = ({ icon: Icon, title, description, action }: EmptyStateProps) => {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-tertiary" />
            </div>
            <h3 className="text-sm font-medium text-primary mb-1">{title}</h3>
            <p className="text-tertiary text-xs max-w-xs mb-4">{description}</p>
            {action}
        </div>
    );
};
