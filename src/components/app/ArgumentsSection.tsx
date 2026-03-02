import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, AtSign } from 'lucide-react';
import { Avatar } from './feedback/Avatar';
import { users, currentUser } from '../../data/mockData';
import type { Argument, User, VoteOption } from '../../types';

interface ArgumentsSectionProps {
    arguments: Argument[];
    options: VoteOption[];
    onAddArgument?: (optionId: string, text: string, mentions: string[]) => void;
    canAddArgument?: boolean;
}

const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'À l\'instant';
    if (minutes < 60) return `Il y a ${minutes}min`;
    if (hours < 24) return `Il y a ${hours}h`;
    if (days < 7) return `Il y a ${days}j`;
    return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short' }).format(date);
};

const highlightMentions = (text: string) => {
    const mentionRegex = /@(\w+)/g;
    const parts = text.split(mentionRegex);
    
    return parts.map((part, index) => {
        if (index % 2 === 1) {
            // This is a mention
            return (
                <span key={index} className="text-emerald-600 dark:text-emerald-400 font-medium">
                    @{part}
                </span>
            );
        }
        return part;
    });
};

export const ArgumentsSection = ({ 
    arguments: args, 
    options,
    onAddArgument,
    canAddArgument = true 
}: ArgumentsSectionProps) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [newArgument, setNewArgument] = useState('');
    const [selectedOption, setSelectedOption] = useState(options[0]?.id || '');
    const [showMentions, setShowMentions] = useState(false);
    const [mentionFilter, setMentionFilter] = useState('');
    const [cursorPosition, setCursorPosition] = useState(0);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    // Group arguments by option
    const argumentsByOption = options.reduce((acc, opt) => {
        acc[opt.id] = args.filter(arg => arg.optionId === opt.id);
        return acc;
    }, {} as Record<string, Argument[]>);

    // Filter users for mentions
    const filteredUsers = users.filter(u => 
        u.id !== currentUser.id &&
        (u.firstName.toLowerCase().includes(mentionFilter.toLowerCase()) ||
         u.lastName.toLowerCase().includes(mentionFilter.toLowerCase()))
    );

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        const position = e.target.selectionStart || 0;
        setNewArgument(value);
        setCursorPosition(position);

        // Check if we should show mention suggestions
        const textBeforeCursor = value.slice(0, position);
        const lastAtIndex = textBeforeCursor.lastIndexOf('@');
        
        if (lastAtIndex !== -1) {
            const textAfterAt = textBeforeCursor.slice(lastAtIndex + 1);
            if (!textAfterAt.includes(' ')) {
                setMentionFilter(textAfterAt);
                setShowMentions(true);
                return;
            }
        }
        setShowMentions(false);
    };

    const insertMention = (user: User) => {
        const textBeforeCursor = newArgument.slice(0, cursorPosition);
        const lastAtIndex = textBeforeCursor.lastIndexOf('@');
        const textAfterCursor = newArgument.slice(cursorPosition);
        
        const newText = textBeforeCursor.slice(0, lastAtIndex) + 
            `@${user.firstName}` + 
            (textAfterCursor.startsWith(' ') ? '' : ' ') + 
            textAfterCursor;
        
        setNewArgument(newText);
        setShowMentions(false);
        inputRef.current?.focus();
    };

    const handleSubmit = () => {
        if (!newArgument.trim() || !selectedOption) return;
        
        // Extract mentions from text
        const mentionRegex = /@(\w+)/g;
        const mentions: string[] = [];
        let match;
        while ((match = mentionRegex.exec(newArgument)) !== null) {
            const mentionName = match[1].toLowerCase();
            const mentionedUser = users.find(u => 
                u.firstName.toLowerCase() === mentionName
            );
            if (mentionedUser) {
                mentions.push(mentionedUser.id);
            }
        }

        onAddArgument?.(selectedOption, newArgument.trim(), mentions);
        setNewArgument('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            handleSubmit();
        }
        if (e.key === 'Escape') {
            setShowMentions(false);
        }
    };

    return (
        <section className="bg-card border border-zinc-200 dark:border-white/5 rounded-lg p-5">
            {/* Header */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between"
            >
                <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-tertiary" />
                    <h2 className="text-xs font-medium text-tertiary uppercase tracking-wider">
                        Arguments ({args.length})
                    </h2>
                </div>
                <span className="text-xs text-tertiary">
                    {isExpanded ? '−' : '+'}
                </span>
            </button>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        {/* Arguments list by option */}
                        <div className="mt-4 space-y-4">
                            {options.map(option => {
                                const optionArgs = argumentsByOption[option.id] || [];
                                if (optionArgs.length === 0) return null;

                                return (
                                    <div key={option.id}>
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                            <span className="text-xs font-medium text-secondary">
                                                {option.label}
                                            </span>
                                            <span className="text-xs text-tertiary">
                                                ({optionArgs.length})
                                            </span>
                                        </div>
                                        <div className="space-y-2 ml-4">
                                            {optionArgs.map(arg => (
                                                <div
                                                    key={arg.id}
                                                    className="flex items-start gap-2 p-2 rounded-lg bg-zinc-50 dark:bg-white/[0.02]"
                                                >
                                                    <Avatar
                                                        firstName={arg.user.firstName}
                                                        lastName={arg.user.lastName}
                                                        color={arg.user.avatarColor}
                                                        size="xs"
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs font-medium text-primary">
                                                                {arg.user.firstName}
                                                            </span>
                                                            <span className="text-[10px] text-tertiary">
                                                                {formatTimeAgo(arg.createdAt)}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-secondary mt-0.5 leading-relaxed">
                                                            {highlightMentions(arg.text)}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}

                            {args.length === 0 && (
                                <p className="text-sm text-tertiary text-center py-4">
                                    Aucun argument pour le moment. Soyez le premier à argumenter !
                                </p>
                            )}
                        </div>

                        {/* Add argument form */}
                        {canAddArgument && (
                            <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-white/5">
                                <div className="flex items-center gap-2 mb-2">
                                    <select
                                        value={selectedOption}
                                        onChange={(e) => setSelectedOption(e.target.value)}
                                        className="text-xs bg-zinc-100 dark:bg-white/5 border-0 rounded px-2 py-1 text-primary"
                                    >
                                        {options.map(opt => (
                                            <option key={opt.id} value={opt.id}>
                                                Argumenter pour : {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="relative">
                                    <textarea
                                        ref={inputRef}
                                        value={newArgument}
                                        onChange={handleInputChange}
                                        onKeyDown={handleKeyDown}
                                        placeholder="Votre argument... (utilisez @ pour mentionner)"
                                        rows={2}
                                        className="w-full bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5 rounded-lg px-3 py-2 text-sm text-primary placeholder:text-tertiary resize-none focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                    />

                                    {/* Mention suggestions */}
                                    <AnimatePresence>
                                        {showMentions && filteredUsers.length > 0 && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -5 }}
                                                className="absolute bottom-full left-0 mb-1 w-48 bg-card border border-zinc-200 dark:border-white/10 rounded-lg shadow-lg overflow-hidden z-10"
                                            >
                                                <div className="px-2 py-1 text-[10px] text-tertiary border-b border-zinc-200 dark:border-white/5">
                                                    <AtSign className="w-3 h-3 inline mr-1" />
                                                    Mentionner
                                                </div>
                                                {filteredUsers.slice(0, 5).map(user => (
                                                    <button
                                                        key={user.id}
                                                        onClick={() => insertMention(user)}
                                                        className="w-full flex items-center gap-2 px-2 py-1.5 text-left hover:bg-zinc-50 dark:hover:bg-white/5"
                                                    >
                                                        <Avatar
                                                            firstName={user.firstName}
                                                            lastName={user.lastName}
                                                            color={user.avatarColor}
                                                            size="xs"
                                                        />
                                                        <span className="text-sm text-primary">
                                                            {user.firstName} {user.lastName}
                                                        </span>
                                                    </button>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <div className="absolute right-2 bottom-2 flex items-center gap-2">
                                        <span className="text-[10px] text-tertiary">
                                            ⌘↵ pour envoyer
                                        </span>
                                        <button
                                            onClick={handleSubmit}
                                            disabled={!newArgument.trim()}
                                            className="p-1.5 bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-300 dark:disabled:bg-white/10 rounded-lg transition-colors"
                                        >
                                            <Send className="w-3.5 h-3.5 text-white" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};
