import { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
    LayoutDashboard, 
    Vote, 
    History, 
    Users, 
    Settings,
    Plus,
    Sun,
    Moon,
    Bell,
    BarChart3,
    FileText,
    Search,
    Menu,
    X,
    Building2,
    LogOut
} from 'lucide-react';
import { useTheme } from '../../ThemeProvider';
import { useAuth, useNotifications } from '../../../hooks';
import { CommandPalette } from '../CommandPalette';
import { NotificationCenter } from '../NotificationCenter';
import { Logo } from '../../Logo';
import { LanguageToggle } from '../../LanguageToggle';

const allNavigation = [
    { key: 'nav.dashboard', href: '/app', icon: LayoutDashboard, shortcut: 'D', adminOnly: false },
    { key: 'nav.decisions', href: '/app/decisions', icon: Vote, shortcut: null, adminOnly: false },
    { key: 'nav.history', href: '/app/history', icon: History, shortcut: null, adminOnly: false },
    { key: 'nav.analytics', href: '/app/analytics', icon: BarChart3, shortcut: null, adminOnly: false },
    { key: 'nav.team', href: '/app/team', icon: Users, shortcut: null, adminOnly: false },
    { key: 'nav.poles', href: '/app/poles', icon: Building2, shortcut: null, adminOnly: false },
    { key: 'nav.auditLog', href: '/app/audit', icon: FileText, shortcut: null, adminOnly: true },
    { key: 'nav.settings', href: '/app/settings', icon: Settings, shortcut: null, adminOnly: false },
];

export const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { theme, setTheme } = useTheme();
    const { profile, canManage, signOut } = useAuth();
    const { unreadCount: unreadNotifications } = useNotifications();
    const { t } = useTranslation();
    const pendingVotes = 0;

    const navigation = allNavigation.filter(item => !item.adminOnly || canManage);

    const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const isActive = (href: string) => {
        if (href === '/app') {
            return location.pathname === '/app';
        }
        return location.pathname.startsWith(href);
    };

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location.pathname]);

    // Global keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setCommandPaletteOpen(true);
                return;
            }

            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                return;
            }

            if (e.key === 'n' && !e.metaKey && !e.ctrlKey) {
                e.preventDefault();
                navigate('/app/decisions/new');
                return;
            }

            if (e.key === 'd' && !e.metaKey && !e.ctrlKey) {
                e.preventDefault();
                navigate('/app');
                return;
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [navigate]);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [mobileMenuOpen]);

    const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
        <>
            {/* Logo */}
            <div className={`px-4 py-4 border-b border-zinc-200 dark:border-white/5 flex items-center justify-between`}>
                <Logo size="sm" linkTo="/app" />
                {isMobile && (
                    <button 
                        onClick={() => setMobileMenuOpen(false)}
                        className="p-2 text-secondary hover:text-primary transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>

            {/* Search Button */}
            <div className="px-3 py-2">
                <button
                    onClick={() => { setCommandPaletteOpen(true); setMobileMenuOpen(false); }}
                    className="flex items-center gap-2 w-full px-3 py-2 bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 rounded-lg transition-colors"
                >
                    <Search className="w-4 h-4 text-tertiary" />
                    <span className="text-sm text-tertiary flex-1 text-left">{t('common.search', 'Rechercher...')}</span>
                    <kbd className="hidden sm:block px-1.5 py-0.5 text-[10px] bg-white dark:bg-white/10 border border-zinc-200 dark:border-white/10 rounded text-tertiary">
                        ⌘K
                    </kbd>
                </button>
            </div>

            {/* New Decision Button */}
            <div className="px-3 py-2">
                <NavLink
                    to="/app/decisions/new"
                    className="flex items-center justify-center gap-1.5 w-full px-3 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-medium rounded-lg transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    <span>{t('app.dashboard.newDecision')}</span>
                </NavLink>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-1 overflow-y-auto">
                <ul className="space-y-0.5">
                    {navigation.map((item) => {
                        const active = isActive(item.href);
                        const showBadge = item.href === '/app/decisions' && pendingVotes > 0;
                        
                        return (
                            <li key={item.key}>
                                <NavLink
                                    to={item.href}
                                    className={`
                                        flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors
                                        ${active 
                                            ? 'bg-zinc-100 dark:bg-white/5 text-primary font-medium' 
                                            : 'text-secondary hover:text-primary hover:bg-zinc-50 dark:hover:bg-white/[0.03]'
                                        }
                                    `}
                                >
                                    <item.icon className={`w-4 h-4 ${active ? 'text-emerald-500' : ''}`} />
                                    <span className="flex-1">{t(item.key)}</span>
                                    {showBadge && (
                                        <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded">
                                            {pendingVotes}
                                        </span>
                                    )}
                                    {!isMobile && item.shortcut && (
                                        <kbd className="px-1 py-0.5 text-[10px] bg-zinc-100 dark:bg-white/5 rounded text-tertiary">
                                            {item.shortcut}
                                        </kbd>
                                    )}
                                </NavLink>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Bottom section */}
            <div className="px-3 py-3 border-t border-zinc-200 dark:border-white/5 space-y-1">
                {/* Notifications */}
                <button
                    onClick={() => { setNotificationsOpen(!notificationsOpen); setMobileMenuOpen(false); }}
                    className={`flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-sm transition-colors ${
                        notificationsOpen 
                            ? 'bg-zinc-100 dark:bg-white/5 text-primary' 
                            : 'text-secondary hover:text-primary hover:bg-zinc-50 dark:hover:bg-white/[0.03]'
                    }`}
                >
                    <Bell className={`w-4 h-4 ${notificationsOpen ? 'text-emerald-500' : ''}`} />
                    <span className="flex-1 text-left">{t('common.notifications', 'Notifications')}</span>
                    {unreadNotifications > 0 && (
                        <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-emerald-500 text-white rounded-full min-w-[18px] text-center">
                            {unreadNotifications}
                        </span>
                    )}
                </button>

                {/* Theme Toggle */}
                <button
                    onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                    className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-sm text-secondary hover:text-primary hover:bg-zinc-50 dark:hover:bg-white/[0.03] transition-colors"
                >
                    {theme === 'light' ? (
                        <>
                            <Moon className="w-4 h-4" />
                            <span>{t('common.darkMode', 'Mode sombre')}</span>
                        </>
                    ) : (
                        <>
                            <Sun className="w-4 h-4" />
                            <span>{t('common.lightMode', 'Mode clair')}</span>
                        </>
                    )}
                </button>

                {/* Language Toggle */}
                <div className="flex items-center justify-between px-2 py-1">
                    <LanguageToggle />
                    <button
                        onClick={signOut}
                        className="flex items-center gap-1.5 px-2 py-1 text-xs text-tertiary hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                        title={t('app.sidebar.signOut')}
                    >
                        <LogOut className="w-3.5 h-3.5" />
                        <span className="hidden xl:inline">{t('app.sidebar.signOut')}</span>
                    </button>
                </div>

                {/* User */}
                <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-zinc-50 dark:hover:bg-white/[0.03] transition-colors cursor-pointer">
                    {profile ? (
                        <>
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-medium text-xs flex-shrink-0">
                                {profile.first_name?.[0] || profile.email?.[0]?.toUpperCase() || '?'}
                                {profile.last_name?.[0] || ''}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-primary truncate">
                                    {profile.first_name && profile.last_name
                                        ? `${profile.first_name} ${profile.last_name}`
                                        : profile.email}
                                </p>
                                <p className="text-xs text-tertiary truncate">{profile.email}</p>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-white/10 animate-pulse flex-shrink-0" />
                            <div className="flex-1 min-w-0 space-y-1.5">
                                <div className="h-3 bg-zinc-200 dark:bg-white/10 rounded animate-pulse w-24" />
                                <div className="h-2.5 bg-zinc-200 dark:bg-white/10 rounded animate-pulse w-32" />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );

    return (
        <>
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-lg border-b border-zinc-200 dark:border-white/5">
                <div className="flex items-center justify-between px-4 py-3">
                    <button 
                        onClick={() => setMobileMenuOpen(true)}
                        className="p-2 -ml-2 text-secondary hover:text-primary transition-colors"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                    <Logo size="sm" linkTo="/app" />
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setNotificationsOpen(true)}
                            className="relative p-2 text-secondary hover:text-primary transition-colors"
                        >
                            <Bell className="w-5 h-5" />
                            {unreadNotifications > 0 && (
                                <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="lg:hidden fixed inset-0 bg-black/50 z-40"
                            onClick={() => setMobileMenuOpen(false)}
                        />
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'tween', duration: 0.25 }}
                            className="lg:hidden fixed left-0 top-0 bottom-0 w-72 bg-card z-50 flex flex-col shadow-2xl"
                        >
                            <SidebarContent isMobile />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-56 bg-card border-r border-zinc-200 dark:border-white/5 flex-col">
                <SidebarContent />
            </aside>

            {/* Command Palette */}
            <CommandPalette 
                isOpen={commandPaletteOpen} 
                onClose={() => setCommandPaletteOpen(false)} 
            />

            {/* Notification Center */}
            <NotificationCenter 
                isOpen={notificationsOpen} 
                onClose={() => setNotificationsOpen(false)} 
            />
        </>
    );
};
