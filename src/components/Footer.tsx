import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import { useTranslation } from 'react-i18next';

export const Footer = () => {
    const { t } = useTranslation();

    const footerLinks = {
        product: [
            { label: t('landing.footer.features'), href: '#features' },
            { label: t('landing.footer.pricing'), href: '#pricing' },
            { label: t('landing.footer.faq'), href: '#faq' },
            { label: t('landing.footer.roadmap'), href: '#', comingSoon: true },
        ],
        resources: [
            { label: t('landing.footer.docs'), href: '#' },
        ],
        company: [
            { label: t('landing.footer.about'), href: '#' },
            { label: t('landing.footer.contact'), href: '#' },
        ],
        legal: [
            { label: t('landing.footer.privacy'), href: '/privacy' },
            { label: t('landing.footer.terms'), href: '/terms' },
            { label: t('landing.footer.mentions'), href: '/mentions-legales' },
            { label: t('landing.footer.rgpd'), href: '/rgpd' },
        ],
    };
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
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 max-w-3xl mx-auto w-full">
                        
                        {/* Brand column */}
                        <div className="col-span-2">
                            <div className="mb-6 flex justify-start">
                                <Logo size="md" linkTo="/" className="justify-start" />
                            </div>
                            <p className="text-sm text-secondary mb-6 max-w-xs">
                                {t('landing.footer.tagline')}
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
                                    aria-label="Instagram"
                                >
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                    </svg>
                                </a>
                            </div>
                        </div>

                        {/* Product */}
                        <div>
                            <h4 className="text-sm font-semibold text-primary mb-4">{t('landing.footer.product')}</h4>
                            <ul className="space-y-3">
                                {footerLinks.product.map((link) => (
                                    <li key={link.label} className="flex items-center gap-2">
                                        <a href={link.href} className="text-sm text-tertiary hover:text-primary transition-colors">
                                            {link.label}
                                        </a>
                                        {(link as any).comingSoon && (
                                            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-zinc-100 dark:bg-white/5 text-tertiary border border-zinc-200 dark:border-white/10">
                                                {t('common.comingSoon')}
                                            </span>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Legal */}
                        <div>
                            <h4 className="text-sm font-semibold text-primary mb-4">{t('landing.footer.legal')}</h4>
                            <ul className="space-y-3">
                                {footerLinks.legal.map((link) => (
                                    <li key={link.label}>
                                        <Link to={link.href} className="text-sm text-tertiary hover:text-primary transition-colors">
                                            {link.label}
                                        </Link>
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
                            {t('landing.footer.rights')}
                        </p>
                        <div className="flex items-center gap-6 text-sm text-tertiary">
                            <span className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                {t('landing.footer.status')}
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
