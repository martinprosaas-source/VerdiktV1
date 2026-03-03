import { useEffect, useState } from 'react';
import { useOnboarding, type Pole } from '../../../context/OnboardingContext';
import { Building2, Plus, X, Edit2, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PRESET_COLORS = [
    { name: 'Purple', value: '#a855f7' },
    { name: 'Pink', value: '#ec4899' },
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Emerald', value: '#10b981' },
    { name: 'Orange', value: '#f97316' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Yellow', value: '#eab308' },
    { name: 'Cyan', value: '#06b6d4' },
];

export const StepPoles = () => {
    const { data, updateData, setCanGoNext } = useOnboarding();
    const [editingPole, setEditingPole] = useState<string | null>(null);
    const [showColorPicker, setShowColorPicker] = useState<string | null>(null);
    const [newPoleName, setNewPoleName] = useState('');
    const [newPoleDescription, setNewPoleDescription] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);

    // Step is optional but we have 4 default poles, so always allow next
    useEffect(() => {
        setCanGoNext(true);
    }, [setCanGoNext]);

    const updatePole = (poleId: string, updates: Partial<Pole>) => {
        const updatedPoles = data.poles.map(pole =>
            pole.id === poleId ? { ...pole, ...updates } : pole
        );
        updateData({ poles: updatedPoles });
    };

    const deletePole = (poleId: string) => {
        // Ne permet pas de supprimer si c'est le dernier pôle
        if (data.poles.length === 1) return;
        
        const updatedPoles = data.poles.filter(pole => pole.id !== poleId);
        updateData({ poles: updatedPoles });
    };

    const addCustomPole = () => {
        if (!newPoleName.trim()) return;

        const newPole: Pole = {
            id: `pole-${Date.now()}`,
            name: newPoleName,
            description: newPoleDescription,
            color: PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)].value,
        };

        updateData({ poles: [...data.poles, newPole] });
        setNewPoleName('');
        setNewPoleDescription('');
        setShowAddForm(false);
    };

    return (
        <div className="space-y-6">
            {/* Info banner */}
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                <p className="text-sm text-emerald-600 dark:text-emerald-400">
                    💡 Les pôles vous permettent d'organiser votre équipe par département. Vous pouvez les modifier à tout moment.
                </p>
            </div>

            {/* Poles list */}
            <div className="space-y-3">
                <AnimatePresence>
                    {data.poles.map((pole) => {
                        const isEditing = editingPole === pole.id;
                        const showingColor = showColorPicker === pole.id;

                        return (
                            <motion.div
                                key={pole.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="relative"
                            >
                                <div className="p-4 bg-card border border-zinc-200 dark:border-white/10 rounded-xl hover:border-zinc-300 dark:hover:border-white/20 transition-all">
                                    <div className="flex items-start gap-4">
                                        {/* Color indicator */}
                                        <div className="relative">
                                            <button
                                                onClick={() => setShowColorPicker(showingColor ? null : pole.id)}
                                                className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform hover:scale-105"
                                                style={{ backgroundColor: pole.color }}
                                            >
                                                <Building2 className="w-6 h-6 text-white" />
                                            </button>

                                            {/* Color picker dropdown */}
                                            <AnimatePresence>
                                                {showingColor && (
                                                    <motion.div
                                                        initial={{ opacity: 0, scale: 0.9, y: -10 }}
                                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                                        exit={{ opacity: 0, scale: 0.9, y: -10 }}
                                                        className="absolute top-full left-0 mt-2 p-3 bg-card border border-zinc-200 dark:border-white/10 rounded-xl shadow-xl z-10"
                                                    >
                                                        <div className="grid grid-cols-4 gap-2">
                                                            {PRESET_COLORS.map((color) => (
                                                                <button
                                                                    key={color.value}
                                                                    onClick={() => {
                                                                        updatePole(pole.id, { color: color.value });
                                                                        setShowColorPicker(null);
                                                                    }}
                                                                    className="w-8 h-8 rounded-lg transition-transform hover:scale-110"
                                                                    style={{ backgroundColor: color.value }}
                                                                    title={color.name}
                                                                >
                                                                    {pole.color === color.value && (
                                                                        <Check className="w-4 h-4 text-white mx-auto" />
                                                                    )}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>

                                        {/* Pole info */}
                                        <div className="flex-1 min-w-0">
                                            {isEditing ? (
                                                <div className="space-y-2">
                                                    <input
                                                        type="text"
                                                        value={pole.name}
                                                        onChange={(e) => updatePole(pole.id, { name: e.target.value })}
                                                        className="w-full px-3 py-1.5 bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-lg text-sm text-primary focus:outline-none focus:border-emerald-500"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={pole.description}
                                                        onChange={(e) => updatePole(pole.id, { description: e.target.value })}
                                                        className="w-full px-3 py-1.5 bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-lg text-sm text-secondary focus:outline-none focus:border-emerald-500"
                                                    />
                                                </div>
                                            ) : (
                                                <>
                                                    <h3 className="font-medium text-primary mb-1">
                                                        {pole.name}
                                                    </h3>
                                                    <p className="text-sm text-secondary">
                                                        {pole.description}
                                                    </p>
                                                </>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => setEditingPole(isEditing ? null : pole.id)}
                                                className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 flex items-center justify-center transition-colors"
                                            >
                                                <Edit2 className="w-4 h-4 text-tertiary" />
                                            </button>
                                            {data.poles.length > 1 && (
                                                <button
                                                    onClick={() => deletePole(pole.id)}
                                                    className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center transition-colors"
                                                >
                                                    <X className="w-4 h-4 text-red-500" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* Add custom pole */}
            {showAddForm ? (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 bg-card border border-emerald-500/50 rounded-xl"
                >
                    <div className="space-y-3">
                        <input
                            type="text"
                            value={newPoleName}
                            onChange={(e) => setNewPoleName(e.target.value)}
                            placeholder="Nom du pôle (ex: Pôle Ventes)"
                            className="w-full px-4 py-2.5 bg-background border border-zinc-200 dark:border-white/10 rounded-lg text-primary placeholder:text-tertiary focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                        />
                        <input
                            type="text"
                            value={newPoleDescription}
                            onChange={(e) => setNewPoleDescription(e.target.value)}
                            placeholder="Description (optionnel)"
                            className="w-full px-4 py-2.5 bg-background border border-zinc-200 dark:border-white/10 rounded-lg text-primary placeholder:text-tertiary focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                        />
                        <div className="flex gap-2">
                            <motion.button
                                onClick={addCustomPole}
                                disabled={!newPoleName.trim()}
                                whileHover={{ scale: newPoleName.trim() ? 1.02 : 1 }}
                                whileTap={{ scale: newPoleName.trim() ? 0.98 : 1 }}
                                className="flex-1 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-200 dark:disabled:bg-white/10 disabled:text-tertiary text-white font-medium rounded-lg transition-colors"
                            >
                                Ajouter
                            </motion.button>
                            <button
                                onClick={() => {
                                    setShowAddForm(false);
                                    setNewPoleName('');
                                    setNewPoleDescription('');
                                }}
                                className="px-4 py-2.5 bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 text-primary rounded-lg transition-colors"
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                </motion.div>
            ) : (
                <motion.button
                    onClick={() => setShowAddForm(true)}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full p-4 border-2 border-dashed border-zinc-200 dark:border-white/10 hover:border-emerald-500 rounded-xl flex items-center justify-center gap-2 text-secondary hover:text-emerald-500 transition-all group"
                >
                    <Plus className="w-5 h-5" />
                    <span className="font-medium">Ajouter un pôle personnalisé</span>
                </motion.button>
            )}

            {/* Summary */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 bg-zinc-50 dark:bg-white/5 rounded-xl"
            >
                <p className="text-sm text-secondary">
                    <span className="font-medium text-emerald-500">{data.poles.length}</span> pôle{data.poles.length > 1 ? 's' : ''} créé{data.poles.length > 1 ? 's' : ''}. Vous pourrez assigner les membres à leurs pôles après l'onboarding.
                </p>
            </motion.div>
        </div>
    );
};
