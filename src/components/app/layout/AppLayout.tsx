import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export const AppLayout = () => {
    return (
        <div className="min-h-screen bg-background">
            <Sidebar />
            {/* Main content - margin left only on desktop, padding top on mobile for header */}
            <main className="lg:ml-56 min-h-screen bg-background relative overflow-hidden pt-14 lg:pt-0">
                {/* Grid pattern with fade - inspired by landing page */}
                <div className="absolute inset-x-0 top-0 h-96 pointer-events-none">
                    {/* Subtle gradient orb - emerald glow */}
                    <div className="absolute -top-20 left-1/3 w-[500px] h-[400px] bg-emerald-500/[0.07] rounded-full blur-[100px]" />
                    <div className="absolute -top-10 right-1/4 w-[300px] h-[300px] bg-emerald-400/[0.05] rounded-full blur-[80px]" />
                    
                    {/* Grid pattern */}
                    <div 
                        className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.04)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:48px_48px]"
                        style={{
                            maskImage: 'linear-gradient(to bottom, black 0%, black 20%, transparent 100%)',
                            WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 20%, transparent 100%)'
                        }}
                    />
                </div>
                
                {/* Content - responsive padding */}
                <div className="relative z-10 px-4 sm:px-6 lg:px-12 py-4 lg:py-6">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};
