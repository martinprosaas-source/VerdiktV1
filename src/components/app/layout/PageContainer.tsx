import type { ReactNode } from 'react';

interface PageContainerProps {
    children: ReactNode;
    wide?: boolean;
}

export const PageContainer = ({ children, wide = false }: PageContainerProps) => {
    return (
        <main className="ml-56 min-h-screen bg-background">
            <div className={`mx-auto px-8 py-6 ${wide ? 'max-w-7xl' : 'max-w-5xl'}`}>
                {children}
            </div>
        </main>
    );
};
