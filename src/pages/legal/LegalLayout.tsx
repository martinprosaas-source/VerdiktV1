import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, FileText, Shield, Lock, Scale } from 'lucide-react';
import { Logo } from '../../components/Logo';

interface Section {
    id: string;
    label: string;
}

interface LegalLayoutProps {
    title: string;
    subtitle?: string;
    lastUpdated: string;
    icon?: React.ReactNode;
    sections?: Section[];
    children: React.ReactNode;
}

const navLinks = [
    { to: '/mentions-legales', label: 'Mentions légales', icon: <Scale className="w-3.5 h-3.5" /> },
    { to: '/terms', label: 'CGU', icon: <FileText className="w-3.5 h-3.5" /> },
    { to: '/privacy', label: 'Confidentialité', icon: <Lock className="w-3.5 h-3.5" /> },
    { to: '/rgpd', label: 'RGPD', icon: <Shield className="w-3.5 h-3.5" /> },
];

export const LegalLayout = ({ title, subtitle, lastUpdated, icon, children }: LegalLayoutProps) => {
    const location = useLocation();

    return (
        <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-30 bg-zinc-950/80 backdrop-blur-md border-b border-white/5">
                <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
                    <Logo size="sm" linkTo="/" />
                    <Link
                        to="/"
                        className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        Retour
                    </Link>
                </div>
            </header>

            {/* Hero banner */}
            <div className="relative overflow-hidden border-b border-white/5">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-emerald-500/10 rounded-full blur-[100px]" />
                    <div
                        className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:40px_40px]"
                        style={{
                            maskImage: 'radial-gradient(ellipse 70% 100% at 50% 0%, black, transparent)',
                            WebkitMaskImage: 'radial-gradient(ellipse 70% 100% at 50% 0%, black, transparent)',
                        }}
                    />
                </div>
                <div className="relative z-10 max-w-5xl mx-auto px-6 py-14 flex flex-col items-center text-center gap-4">
                    {icon && (
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                            {icon}
                        </div>
                    )}
                    <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">{title}</h1>
                    {subtitle && <p className="text-zinc-400 text-base max-w-xl">{subtitle}</p>}
                    <span className="inline-flex items-center gap-1.5 text-xs text-zinc-500 bg-white/5 border border-white/8 px-3 py-1.5 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Dernière mise à jour : {lastUpdated}
                    </span>
                </div>
            </div>

            {/* Body */}
            <div className="flex-1 max-w-5xl mx-auto w-full px-6 py-12 flex gap-12">

                {/* Sidebar nav */}
                <aside className="hidden lg:flex flex-col gap-1 w-48 shrink-0 sticky top-24 self-start">
                    <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3 px-3">Documents</p>
                    {navLinks.map(({ to, label, icon: navIcon }) => {
                        const active = location.pathname === to;
                        return (
                            <Link
                                key={to}
                                to={to}
                                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${
                                    active
                                        ? 'bg-emerald-500/10 text-emerald-400 font-medium'
                                        : 'text-zinc-400 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                {navIcon}
                                {label}
                            </Link>
                        );
                    })}
                </aside>

                {/* Content */}
                <main className="flex-1 min-w-0">
                    {/* Mobile nav pills */}
                    <div className="flex flex-wrap gap-2 mb-10 lg:hidden">
                        {navLinks.map(({ to, label }) => {
                            const active = location.pathname === to;
                            return (
                                <Link
                                    key={to}
                                    to={to}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                                        active
                                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                            : 'border-white/10 text-zinc-400 hover:border-white/20 hover:text-white'
                                    }`}
                                >
                                    {label}
                                </Link>
                            );
                        })}
                    </div>

                    <div className="
                        prose prose-invert max-w-none
                        prose-headings:font-semibold prose-headings:tracking-tight
                        prose-h2:text-base prose-h2:text-white
                        prose-h2:mt-10 prose-h2:mb-3 prose-h2:first:mt-0
                        prose-p:text-zinc-400 prose-p:leading-relaxed prose-p:text-sm prose-p:my-2
                        prose-li:text-zinc-400 prose-li:text-sm prose-li:my-0.5
                        prose-ul:my-3 prose-ul:pl-4
                        prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:underline prose-a:font-normal
                        prose-strong:text-zinc-200 prose-strong:font-semibold
                        [&_h2]:flex [&_h2]:items-center [&_h2]:gap-2
                        [&_h2]:before:content-[''] [&_h2]:before:w-1 [&_h2]:before:h-4
                        [&_h2]:before:rounded-full [&_h2]:before:bg-emerald-500
                        [&_h2]:before:shrink-0
                    ">
                        {children}
                    </div>
                </main>
            </div>

            {/* Footer */}
            <footer className="border-t border-white/5 py-6 px-6">
                <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-4">
                    <p className="text-xs text-zinc-600">© {new Date().getFullYear()} M&A Labs LLC · verdikt.dev</p>
                    <div className="flex flex-wrap gap-4 text-xs text-zinc-500">
                        <Link to="/mentions-legales" className="hover:text-white transition-colors">Mentions légales</Link>
                        <Link to="/terms" className="hover:text-white transition-colors">CGU</Link>
                        <Link to="/privacy" className="hover:text-white transition-colors">Confidentialité</Link>
                        <Link to="/rgpd" className="hover:text-white transition-colors">RGPD</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
};
