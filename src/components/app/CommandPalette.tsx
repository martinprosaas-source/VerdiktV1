import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Search, 
    Vote, 
    Plus, 
    LayoutDashboard, 
    Users, 
    History, 
    Settings,
    BarChart3,
    FileText,
    X
} from 'lucide-react';
import { useDecisions } from '../../hooks/useDecisions';
import { useTeam } from '../../hooks/useTeam';

interface CommandItem {
    id: string;
    title: string;
    subtitle?: string;
    icon: React.ReactNode;
    action: () => void;
    category: 'navigation' | 'decision' | 'user' | 'action';
}

interface CommandPaletteProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CommandPalette = ({ isOpen, onClose }: CommandPaletteProps) => {
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const { decisions } = useDecisions();
    const { members } = useTeam();

    const allCommands: CommandItem[] = useMemo(() => {
        const navigationCommands: CommandItem[] = [
            {
                id: 'nav-dashboard',
                title: 'Dashboard',
                subtitle: 'Accueil de l\'application',
                icon: <LayoutDashboard className="w-4 h-4" />,
                action: () => { navigate('/app'); onClose(); },
                category: 'navigation',
            },
            {
                id: 'nav-decisions',
                title: 'Décisions',
                subtitle: 'Liste des décisions',
                icon: <Vote className="w-4 h-4" />,
                action: () => { navigate('/app/decisions'); onClose(); },
                category: 'navigation',
            },
            {
                id: 'nav-history',
                title: 'Historique',
                subtitle: 'Décisions terminées',
                icon: <History className="w-4 h-4" />,
                action: () => { navigate('/app/history'); onClose(); },
                category: 'navigation',
            },
            {
                id: 'nav-team',
                title: 'Équipe',
                subtitle: 'Gestion des membres',
                icon: <Users className="w-4 h-4" />,
                action: () => { navigate('/app/team'); onClose(); },
                category: 'navigation',
            },
            {
                id: 'nav-analytics',
                title: 'Analytics',
                subtitle: 'Statistiques de l\'équipe',
                icon: <BarChart3 className="w-4 h-4" />,
                action: () => { navigate('/app/analytics'); onClose(); },
                category: 'navigation',
            },
            {
                id: 'nav-audit',
                title: 'Audit Log',
                subtitle: 'Historique des actions',
                icon: <FileText className="w-4 h-4" />,
                action: () => { navigate('/app/audit'); onClose(); },
                category: 'navigation',
            },
            {
                id: 'nav-settings',
                title: 'Paramètres',
                subtitle: 'Configuration',
                icon: <Settings className="w-4 h-4" />,
                action: () => { navigate('/app/settings'); onClose(); },
                category: 'navigation',
            },
        ];

        const actionCommands: CommandItem[] = [
            {
                id: 'action-new',
                title: 'Nouvelle décision',
                subtitle: 'Créer une décision',
                icon: <Plus className="w-4 h-4" />,
                action: () => { navigate('/app/decisions/new'); onClose(); },
                category: 'action',
            },
        ];

        const decisionCommands: CommandItem[] = (decisions || []).map((d: any) => ({
            id: `decision-${d.id}`,
            title: d.title,
            subtitle: d.status === 'active' ? 'Active' : 'Terminée',
            icon: <Vote className="w-4 h-4" />,
            action: () => { navigate(`/app/decisions/${d.id}`); onClose(); },
            category: 'decision',
        }));

        const userCommands: CommandItem[] = (members || []).map(u => ({
            id: `user-${u.id}`,
            title: `${u.first_name} ${u.last_name}`,
            subtitle: u.email,
            icon: <Users className="w-4 h-4" />,
            action: () => { navigate('/app/team'); onClose(); },
            category: 'user',
        }));

        return [...actionCommands, ...navigationCommands, ...decisionCommands, ...userCommands];
    }, [navigate, onClose, decisions, members]);

    const filteredCommands = useMemo(() => {
        if (!query) return allCommands.slice(0, 10);
        
        const lowerQuery = query.toLowerCase();
        return allCommands.filter(cmd => 
            cmd.title.toLowerCase().includes(lowerQuery) ||
            cmd.subtitle?.toLowerCase().includes(lowerQuery)
        ).slice(0, 10);
    }, [query, allCommands]);

    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus();
            setQuery('');
            setSelectedIndex(0);
        }
    }, [isOpen]);

    useEffect(() => {
        setSelectedIndex(0);
    }, [query]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;

            if (e.key === 'Escape') {
                onClose();
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex(i => Math.min(i + 1, filteredCommands.length - 1));
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(i => Math.max(i - 1, 0));
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (filteredCommands[selectedIndex]) {
                    filteredCommands[selectedIndex].action();
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose, filteredCommands, selectedIndex]);

    const getCategoryLabel = (category: string) => {
        switch (category) {
            case 'action': return 'Actions';
            case 'navigation': return 'Navigation';
            case 'decision': return 'Décisions';
            case 'user': return 'Membres';
            default: return category;
        }
    };

    const groupedCommands = useMemo(() => {
        const groups: Record<string, CommandItem[]> = {};
        filteredCommands.forEach(cmd => {
            if (!groups[cmd.category]) groups[cmd.category] = [];
            groups[cmd.category].push(cmd);
        });
        return groups;
    }, [filteredCommands]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        transition={{ duration: 0.15 }}
                        className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-lg z-50"
                    >
                        <div className="bg-card border border-zinc-200 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden">
                            {/* Search input */}
                            <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-200 dark:border-white/5">
                                <Search className="w-4 h-4 text-tertiary" />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Rechercher une décision, membre, action..."
                                    className="flex-1 bg-transparent text-sm text-primary placeholder:text-tertiary outline-none"
                                />
                                <button onClick={onClose} className="text-tertiary hover:text-primary">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Results */}
                            <div className="max-h-80 overflow-y-auto p-2">
                                {filteredCommands.length === 0 ? (
                                    <div className="text-center py-8 text-tertiary text-sm">
                                        Aucun résultat pour "{query}"
                                    </div>
                                ) : (
                                    Object.entries(groupedCommands).map(([category, commands]) => (
                                        <div key={category} className="mb-2">
                                            <div className="px-2 py-1 text-[10px] font-medium text-tertiary uppercase tracking-wider">
                                                {getCategoryLabel(category)}
                                            </div>
                                            {commands.map((cmd) => {
                                                const globalIndex = filteredCommands.indexOf(cmd);
                                                return (
                                                    <button
                                                        key={cmd.id}
                                                        onClick={cmd.action}
                                                        onMouseEnter={() => setSelectedIndex(globalIndex)}
                                                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                                                            globalIndex === selectedIndex
                                                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                                                : 'text-primary hover:bg-zinc-100 dark:hover:bg-white/5'
                                                        }`}
                                                    >
                                                        <span className={globalIndex === selectedIndex ? 'text-emerald-500' : 'text-tertiary'}>
                                                            {cmd.icon}
                                                        </span>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium truncate">{cmd.title}</p>
                                                            {cmd.subtitle && (
                                                                <p className="text-xs text-tertiary truncate">{cmd.subtitle}</p>
                                                            )}
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Footer */}
                            <div className="px-4 py-2 border-t border-zinc-200 dark:border-white/5 flex items-center justify-between text-[10px] text-tertiary">
                                <div className="flex items-center gap-3">
                                    <span><kbd className="px-1.5 py-0.5 bg-zinc-100 dark:bg-white/5 rounded text-[10px]">↑↓</kbd> naviguer</span>
                                    <span><kbd className="px-1.5 py-0.5 bg-zinc-100 dark:bg-white/5 rounded text-[10px]">↵</kbd> sélectionner</span>
                                    <span><kbd className="px-1.5 py-0.5 bg-zinc-100 dark:bg-white/5 rounded text-[10px]">esc</kbd> fermer</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
