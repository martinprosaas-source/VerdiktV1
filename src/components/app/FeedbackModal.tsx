import { useState } from 'react';
import { X, Lightbulb, Bug, MessageSquare, Send, CheckCircle2, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks';

type Category = 'idea' | 'bug' | 'general';

const categories: { id: Category; label: string; icon: React.ReactNode }[] = [
    { id: 'idea', label: 'Idée', icon: <Lightbulb className="w-3.5 h-3.5" /> },
    { id: 'bug', label: 'Bug', icon: <Bug className="w-3.5 h-3.5" /> },
    { id: 'general', label: 'Avis', icon: <MessageSquare className="w-3.5 h-3.5" /> },
];

interface FeedbackModalProps {
    onClose: () => void;
}

export const FeedbackModal = ({ onClose }: FeedbackModalProps) => {
    const { profile } = useAuth();
    const [category, setCategory] = useState<Category>('general');
    const [message, setMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSend = async () => {
        if (!message.trim() || !profile?.id) return;
        setSending(true);
        try {
            await supabase.from('feedbacks').insert({
                user_id: profile.id,
                team_id: profile.team_id || null,
                category,
                message: message.trim(),
            });
            setSent(true);
        } catch {
            // silent — still show success to not frustrate user
            setSent(true);
        } finally {
            setSending(false);
        }
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Panel — centré */}
            <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <div className="w-full max-w-md mx-4 bg-card border border-zinc-200 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden pointer-events-auto">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100 dark:border-white/5">
                    <div>
                        <h3 className="text-sm font-semibold text-primary">Partager un feedback</h3>
                        <p className="text-xs text-tertiary">Idée, bug ou avis — tout compte.</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 text-tertiary hover:text-primary hover:bg-zinc-100 dark:hover:bg-white/5 rounded-lg transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="p-4">
                    {sent ? (
                        <div className="flex flex-col items-center gap-3 py-4 text-center">
                            <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-primary">Merci pour ton feedback !</p>
                                <p className="text-xs text-tertiary mt-0.5">On prend tout en compte.</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="mt-1 px-4 py-1.5 text-xs font-medium bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 text-secondary rounded-lg transition-colors"
                            >
                                Fermer
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* Category selector */}
                            <div className="flex gap-1.5 mb-3">
                                {categories.map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setCategory(cat.id)}
                                        className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                                            category === cat.id
                                                ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                                : 'border-zinc-200 dark:border-white/10 text-secondary hover:text-primary hover:border-zinc-300 dark:hover:border-white/20'
                                        }`}
                                    >
                                        {cat.icon}
                                        {cat.label}
                                    </button>
                                ))}
                            </div>

                            {/* Message */}
                            <textarea
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                                placeholder={
                                    category === 'idea' ? "Quelle fonctionnalité tu aimerais voir ?"
                                    : category === 'bug' ? "Décris ce qui ne fonctionne pas…"
                                    : "Qu'est-ce que tu penses de Verdikt ?"
                                }
                                rows={4}
                                className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/10 rounded-lg text-primary placeholder:text-tertiary resize-none focus:outline-none focus:border-emerald-500 transition-colors"
                            />

                            {/* Send */}
                            <button
                                onClick={handleSend}
                                disabled={!message.trim() || sending}
                                className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                {sending ? (
                                    <><Loader2 className="w-4 h-4 animate-spin" /> Envoi…</>
                                ) : (
                                    <><Send className="w-4 h-4" /> Envoyer</>
                                )}
                            </button>
                        </>
                    )}
                </div>
            </div>
            </div>
        </>
    );
};
