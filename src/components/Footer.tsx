import { Logo } from './Logo';

const footerLinks = {
    product: [
        { label: 'Fonctionnalités', href: '#features' },
        { label: 'Pricing', href: '#pricing' },
        { label: 'Changelog', href: '#' },
        { label: 'Roadmap', href: '#' },
    ],
    resources: [
        { label: 'Documentation', href: '#' },
        { label: 'Blog', href: '#' },
        { label: 'Guides', href: '#' },
        { label: 'API', href: '#' },
    ],
    company: [
        { label: 'À propos', href: '#' },
        { label: 'Carrières', href: '#' },
        { label: 'Contact', href: '#' },
        { label: 'Presse', href: '#' },
    ],
    legal: [
        { label: 'Privacy', href: '#' },
        { label: 'CGU', href: '#' },
        { label: 'Mentions légales', href: '#' },
        { label: 'RGPD', href: '#' },
    ],
};

export const Footer = () => {
    return (
        <footer className="relative bg-card/50 dark:bg-[#050505] transition-colors duration-300 overflow-hidden">
            {/* Grid pattern - mirrors hero */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Emerald glow - like hero */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/[0.08] rounded-full blur-[120px]" />
                <div className="absolute top-20 right-1/4 w-[400px] h-[300px] bg-emerald-400/[0.05] rounded-full blur-[100px]" />
                
                {/* Grid */}
                <div 
                    className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.04)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:48px_48px]"
                    style={{
                        maskImage: 'radial-gradient(ellipse 80% 80% at 50% 0%, black 20%, transparent 70%)',
                        WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 0%, black 20%, transparent 70%)'
                    }}
                />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
                
                {/* Main footer */}
                <div className="py-16 sm:py-20">
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-8 lg:gap-12">
                        
                        {/* Brand column */}
                        <div className="col-span-2">
                            <div className="mb-6">
                                <Logo size="md" linkTo="/" />
                            </div>
                            <p className="text-sm text-secondary mb-6 max-w-xs">
                                L'IA qui structure vos décisions d'équipe et transforme vos réunions en actions.
                            </p>
                            
                            {/* Social links */}
                            <div className="flex items-center gap-3">
                                <a 
                                    href="#" 
                                    className="w-9 h-9 rounded-lg bg-zinc-100 dark:bg-white/5 hover:bg-emerald-500/10 hover:text-emerald-500 flex items-center justify-center text-tertiary transition-all"
                                    aria-label="Twitter"
                                >
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                    </svg>
                                </a>
                                <a 
                                    href="#" 
                                    className="w-9 h-9 rounded-lg bg-zinc-100 dark:bg-white/5 hover:bg-emerald-500/10 hover:text-emerald-500 flex items-center justify-center text-tertiary transition-all"
                                    aria-label="LinkedIn"
                                >
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                    </svg>
                                </a>
                                <a 
                                    href="#" 
                                    className="w-9 h-9 rounded-lg bg-zinc-100 dark:bg-white/5 hover:bg-emerald-500/10 hover:text-emerald-500 flex items-center justify-center text-tertiary transition-all"
                                    aria-label="GitHub"
                                >
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                    </svg>
                                </a>
                            </div>
                        </div>

                        {/* Product */}
                        <div>
                            <h4 className="text-sm font-semibold text-primary mb-4">Produit</h4>
                            <ul className="space-y-3">
                                {footerLinks.product.map((link) => (
                                    <li key={link.label}>
                                        <a href={link.href} className="text-sm text-tertiary hover:text-primary transition-colors">
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Resources */}
                        <div>
                            <h4 className="text-sm font-semibold text-primary mb-4">Ressources</h4>
                            <ul className="space-y-3">
                                {footerLinks.resources.map((link) => (
                                    <li key={link.label}>
                                        <a href={link.href} className="text-sm text-tertiary hover:text-primary transition-colors">
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Company */}
                        <div>
                            <h4 className="text-sm font-semibold text-primary mb-4">Entreprise</h4>
                            <ul className="space-y-3">
                                {footerLinks.company.map((link) => (
                                    <li key={link.label}>
                                        <a href={link.href} className="text-sm text-tertiary hover:text-primary transition-colors">
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Legal */}
                        <div>
                            <h4 className="text-sm font-semibold text-primary mb-4">Légal</h4>
                            <ul className="space-y-3">
                                {footerLinks.legal.map((link) => (
                                    <li key={link.label}>
                                        <a href={link.href} className="text-sm text-tertiary hover:text-primary transition-colors">
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    </div>

                {/* Bottom bar */}
                <div className="py-6 border-t border-zinc-200 dark:border-white/5">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-tertiary">
                            © 2026 Verdikt. Tous droits réservés.
                        </p>
                        <div className="flex items-center gap-6 text-sm text-tertiary">
                            <span className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                Tous les systèmes opérationnels
                            </span>
                            <a href="#" className="hover:text-primary transition-colors">
                                Status
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};
