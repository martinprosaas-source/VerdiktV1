import { motion } from 'framer-motion';
import { 
    UserPlus, 
    Zap, 
    DollarSign, 
    GitBranch, 
    Wrench,
    FileText,
    Check,
    Target,
    Handshake,
    Calendar,
    Shield
} from 'lucide-react';
import { decisionTemplates } from '../../data/mockData';
import type { DecisionTemplate } from '../../types';

const iconMap: Record<string, React.ElementType> = {
    UserPlus,
    Zap,
    DollarSign,
    GitBranch,
    Wrench,
    Target,
    Handshake,
    Calendar,
    Shield,
};

interface TemplateSelectorProps {
    selectedTemplate: DecisionTemplate | null;
    onSelect: (template: DecisionTemplate | null) => void;
}

export const TemplateSelector = ({ selectedTemplate, onSelect }: TemplateSelectorProps) => {
    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-tertiary uppercase tracking-wider">
                    Template (optionnel)
                </label>
                {selectedTemplate && (
                    <button
                        onClick={() => onSelect(null)}
                        className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline"
                    >
                        Réinitialiser
                    </button>
                )}
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                {/* Blank option */}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSelect(null)}
                    className={`relative flex flex-col items-center gap-2 p-3 rounded-lg border transition-all ${
                        !selectedTemplate
                            ? 'border-emerald-500 bg-emerald-500/5'
                            : 'border-zinc-200 dark:border-white/5 hover:border-zinc-300 dark:hover:border-white/10'
                    }`}
                >
                    {!selectedTemplate && (
                        <div className="absolute top-1.5 right-1.5">
                            <Check className="w-3 h-3 text-emerald-500" />
                        </div>
                    )}
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        !selectedTemplate 
                            ? 'bg-emerald-500/10 text-emerald-500' 
                            : 'bg-zinc-100 dark:bg-white/5 text-tertiary'
                    }`}>
                        <FileText className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-medium text-primary">Vide</span>
                </motion.button>

                {/* Templates */}
                {decisionTemplates.map((template) => {
                    const Icon = iconMap[template.icon] || FileText;
                    const isSelected = selectedTemplate?.id === template.id;

                    return (
                        <motion.button
                            key={template.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onSelect(template)}
                            className={`relative flex flex-col items-center gap-2 p-3 rounded-lg border transition-all ${
                                isSelected
                                    ? 'border-emerald-500 bg-emerald-500/5'
                                    : 'border-zinc-200 dark:border-white/5 hover:border-zinc-300 dark:hover:border-white/10'
                            }`}
                        >
                            {isSelected && (
                                <div className="absolute top-1.5 right-1.5">
                                    <Check className="w-3 h-3 text-emerald-500" />
                                </div>
                            )}
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                isSelected 
                                    ? 'bg-emerald-500/10 text-emerald-500' 
                                    : 'bg-zinc-100 dark:bg-white/5 text-tertiary'
                            }`}>
                                <Icon className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-medium text-primary">{template.name}</span>
                        </motion.button>
                    );
                })}
            </div>

            {/* Selected template description */}
            {selectedTemplate && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-lg"
                >
                    <p className="text-xs text-secondary">{selectedTemplate.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="text-[10px] text-tertiary">Options pré-définies :</span>
                        <div className="flex flex-wrap gap-1">
                            {selectedTemplate.defaultOptions.map((opt, i) => (
                                <span key={i} className="px-1.5 py-0.5 text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded">
                                    {opt}
                                </span>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
};
