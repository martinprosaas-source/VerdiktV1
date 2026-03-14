import { useEffect, useState } from 'react';
import { useOnboarding } from '../../../context/OnboardingContext';
import { Sparkles, Lightbulb, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../../../lib/supabase';

const suggestions = [
    "Quel outil de communication interne adopter ?",
    "Faut-il passer au travail hybride ?",
    "Quel CRM choisir pour l'équipe Sales ?",
    "Doit-on recruter un designer senior ?",
];

interface AIStructure {
    context: string;
    options: string[];
    criteria: string[];
}

export const StepFirstDecision = () => {
    const { data, updateData, setCanGoNext } = useOnboarding();
    const [isGenerating, setIsGenerating] = useState(false);
    const [aiStructure, setAiStructure] = useState<AIStructure | null>(null);

    useEffect(() => {
        setCanGoNext(data.firstDecisionQuestion.trim() !== '' || true); // Optional step
    }, [data.firstDecisionQuestion, setCanGoNext]);

    const generateStructure = async () => {
        if (!data.firstDecisionQuestion.trim()) return;

        setIsGenerating(true);
        try {
            const { data: result, error } = await supabase.functions.invoke('structure-decision', {
                body: { question: data.firstDecisionQuestion.trim() },
            });
            if (error) throw error;
            if (result?.context && result?.options && result?.criteria) {
                setAiStructure(result);
            }
        } catch (err) {
            console.error('AI structuring error:', err);
        } finally {
            setIsGenerating(false);
        }
    };

    const useSuggestion = (suggestion: string) => {
        updateData({ firstDecisionQuestion: suggestion });
        setAiStructure(null);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-xl">
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                        <p className="font-medium text-primary mb-1">L'IA structure pour vous</p>
                        <p className="text-sm text-secondary">
                            Posez une question, et Verdikt génère automatiquement le contexte, les options et les critères.
                        </p>
                    </div>
                </div>
            </div>

            {/* Question input */}
            <div>
                <label className="block text-sm font-medium text-primary mb-2">
                    Quelle décision devez-vous prendre ?
                </label>
                <textarea
                    value={data.firstDecisionQuestion}
                    onChange={(e) => {
                        updateData({ firstDecisionQuestion: e.target.value });
                        setAiStructure(null);
                    }}
                    placeholder="Ex: Doit-on augmenter nos prix de 10% ?"
                    rows={3}
                    className="w-full px-4 py-3 bg-card border border-zinc-200 dark:border-white/10 rounded-xl text-primary placeholder:text-tertiary focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all resize-none"
                />
            </div>

            {/* Generate button */}
            {data.firstDecisionQuestion.trim() && !aiStructure && (
                <motion.button
                    onClick={generateStructure}
                    disabled={isGenerating}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-500/50 text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                    {isGenerating ? (
                        <>
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            >
                                <Sparkles className="w-5 h-5" />
                            </motion.div>
                            Structuration en cours...
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-5 h-5" />
                            Structurer avec l'IA
                        </>
                    )}
                </motion.button>
            )}

            {/* AI Structure result */}
            {aiStructure && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 bg-card border border-emerald-500/20 rounded-xl space-y-4"
                >
                    <div className="flex items-center gap-2 text-emerald-500 text-sm font-medium">
                        <Sparkles className="w-4 h-4" />
                        Structuration IA
                    </div>

                    <div>
                        <p className="text-xs text-tertiary uppercase tracking-wider mb-1">Contexte</p>
                        <p className="text-sm text-primary">{aiStructure.context}</p>
                    </div>

                    <div>
                        <p className="text-xs text-tertiary uppercase tracking-wider mb-2">Options identifiées</p>
                        <div className="space-y-1.5">
                            {aiStructure.options.map((option, i) => (
                                <div key={i} className="flex items-center gap-2 text-sm">
                                    <ArrowRight className="w-3 h-3 text-emerald-500" />
                                    <span className="text-secondary">{option}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <p className="text-xs text-tertiary uppercase tracking-wider mb-2">Critères suggérés</p>
                        <div className="flex flex-wrap gap-2">
                            {aiStructure.criteria.map((criterion, i) => (
                                <span key={i} className="px-2 py-1 bg-zinc-100 dark:bg-white/5 text-xs text-secondary rounded-md">
                                    {criterion}
                                </span>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Suggestions */}
            {!data.firstDecisionQuestion && (
                <div>
                    <div className="flex items-center gap-2 text-sm text-tertiary mb-3">
                        <Lightbulb className="w-4 h-4" />
                        Suggestions
                    </div>
                    <div className="space-y-2">
                        {suggestions.map((suggestion, i) => (
                            <motion.button
                                key={i}
                                onClick={() => useSuggestion(suggestion)}
                                whileHover={{ x: 4 }}
                                className="w-full p-3 text-left text-sm text-secondary hover:text-primary bg-zinc-50 dark:bg-white/5 hover:bg-zinc-100 dark:hover:bg-white/10 rounded-lg transition-colors"
                            >
                                "{suggestion}"
                            </motion.button>
                        ))}
                    </div>
                </div>
            )}

            {/* Skip hint */}
            <p className="text-center text-xs text-tertiary">
                Cette étape est optionnelle. Vous pouvez créer votre première décision plus tard.
            </p>
        </div>
    );
};
