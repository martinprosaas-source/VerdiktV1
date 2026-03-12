import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Logo } from '../../components/Logo';

interface LegalLayoutProps {
    title: string;
    lastUpdated: string;
    children: React.ReactNode;
}

export const LegalLayout = ({ title, lastUpdated, children }: LegalLayoutProps) => {
    return (
        <div className="min-h-screen bg-zinc-950 text-white">
            {/* Header */}
            <header className="border-b border-white/5 py-4 px-6">
                <div className="max-w-3xl mx-auto flex items-center justify-between">
                    <Logo size="sm" linkTo="/" />
                    <Link
                        to="/"
                        className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Retour
                    </Link>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-3xl mx-auto px-6 py-16">
                <div className="mb-10">
                    <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
                    <p className="text-sm text-zinc-500">Dernière mise à jour : {lastUpdated}</p>
                </div>

                <div className="prose prose-invert prose-zinc max-w-none
                    prose-headings:font-semibold prose-headings:text-white
                    prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-4
                    prose-p:text-zinc-300 prose-p:leading-relaxed
                    prose-li:text-zinc-300
                    prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:underline
                    prose-strong:text-white
                ">
                    {children}
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-white/5 py-6 px-6 mt-16">
                <div className="max-w-3xl mx-auto flex flex-wrap gap-4 text-xs text-zinc-500">
                    <Link to="/mentions-legales" className="hover:text-white transition-colors">Mentions légales</Link>
                    <Link to="/terms" className="hover:text-white transition-colors">CGU</Link>
                    <Link to="/privacy" className="hover:text-white transition-colors">Politique de confidentialité</Link>
                    <Link to="/rgpd" className="hover:text-white transition-colors">RGPD</Link>
                </div>
            </footer>
        </div>
    );
};
