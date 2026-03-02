import type { ReactNode } from 'react';

interface HeaderProps {
    title: string;
    subtitle?: string;
    actions?: ReactNode;
}

export const Header = ({ title, subtitle, actions }: HeaderProps) => {
    return (
        <header className="flex items-center justify-between mb-6">
            <div>
                <h1 className="text-xl font-semibold text-primary">{title}</h1>
                {subtitle && (
                    <p className="text-secondary text-sm">{subtitle}</p>
                )}
            </div>
            {actions && (
                <div className="flex items-center gap-2">
                    {actions}
                </div>
            )}
        </header>
    );
};
