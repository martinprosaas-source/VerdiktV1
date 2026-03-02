import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Plus, Users, Calendar, ArrowLeft, Building2 } from 'lucide-react';
import { Avatar } from '../../components/app/feedback/Avatar';
import { TemplateSelector } from '../../components/app/TemplateSelector';
import { teamMembers, poles, users } from '../../data/mockData';
import type { DecisionTemplate } from '../../types';

export const NewDecision = () => {
    const navigate = useNavigate();
    const [selectedTemplate, setSelectedTemplate] = useState<DecisionTemplate | null>(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [options, setOptions] = useState(['', '']);
    const [selectedPole, setSelectedPole] = useState<string>('all');
    const [selectedParticipants, setSelectedParticipants] = useState<string[]>(
        teamMembers.map(m => m.id)
    );
    const [deadline, setDeadline] = useState('');

    // Mettre à jour les participants quand un pôle est sélectionné
    useEffect(() => {
        if (selectedPole === 'all') {
            setSelectedParticipants(teamMembers.map(m => m.id));
        } else {
            const poleMembers = users.filter(u => u.poleId === selectedPole).map(u => u.id);
            setSelectedParticipants(poleMembers);
        }
    }, [selectedPole]);

    // Apply template when selected
    useEffect(() => {
        if (selectedTemplate) {
            setDescription(selectedTemplate.suggestedContext);
            setOptions(selectedTemplate.defaultOptions);
        }
    }, [selectedTemplate]);

    const addOption = () => {
        if (options.length < 6) {
            setOptions([...options, '']);
        }
    };

    const removeOption = (index: number) => {
        if (options.length > 2) {
            setOptions(options.filter((_, i) => i !== index));
        }
    };

    const updateOption = (index: number, value: string) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const toggleParticipant = (id: string) => {
        setSelectedParticipants(prev =>
            prev.includes(id)
                ? prev.filter(p => p !== id)
                : [...prev, id]
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        navigate('/app/decisions');
    };

    return (
        <div>
            {/* Header */}
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <button 
                    onClick={() => navigate(-1)}
                    className="p-1.5 text-tertiary hover:text-primary transition-colors rounded"
                >
                    <ArrowLeft className="w-4 h-4" />
                </button>
                <h1 className="text-lg sm:text-xl font-semibold text-primary">Nouvelle décision</h1>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    {/* Main Column */}
                    <div className="lg:col-span-2 xl:col-span-3 space-y-4 sm:space-y-5 order-2 lg:order-1">
                        {/* Template Selector */}
                        <section className="bg-card border border-zinc-200 dark:border-white/5 rounded-lg p-4 sm:p-5">
                            <TemplateSelector
                                selectedTemplate={selectedTemplate}
                                onSelect={setSelectedTemplate}
                            />
                        </section>

                        {/* Title & Description */}
                        <section className="bg-card border border-zinc-200 dark:border-white/5 rounded-lg p-4 sm:p-5">
                            <div className="space-y-3 sm:space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-tertiary mb-1">
                                        Question
                                    </label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Quelle décision devons-nous prendre ?"
                                        className="w-full px-3 py-2.5 sm:py-2 bg-background border border-zinc-200 dark:border-white/5 rounded-lg text-sm text-primary placeholder:text-tertiary focus:outline-none focus:border-emerald-500/50 transition-colors"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-tertiary mb-1">
                                        Contexte (optionnel)
                                    </label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Ajoutez du contexte pour aider l'équipe..."
                                        rows={4}
                                        className="w-full px-3 py-2.5 sm:py-2 bg-background border border-zinc-200 dark:border-white/5 rounded-lg text-sm text-primary placeholder:text-tertiary focus:outline-none focus:border-emerald-500/50 transition-colors resize-none"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Options */}
                        <section className="bg-card border border-zinc-200 dark:border-white/5 rounded-lg p-4 sm:p-5">
                            <label className="block text-xs font-medium text-tertiary mb-3">
                                Options de vote
                            </label>
                            <div className="grid grid-cols-1 gap-2 sm:gap-3">
                                {options.map((option, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <span className="text-xs text-tertiary w-5">{index + 1}.</span>
                                        <input
                                            type="text"
                                            value={option}
                                            onChange={(e) => updateOption(index, e.target.value)}
                                            placeholder={`Option ${index + 1}`}
                                            className="flex-1 px-3 py-2 bg-background border border-zinc-200 dark:border-white/5 rounded-lg text-sm text-primary placeholder:text-tertiary focus:outline-none focus:border-emerald-500/50 transition-colors"
                                            required
                                        />
                                        {options.length > 2 && (
                                            <button
                                                type="button"
                                                onClick={() => removeOption(index)}
                                                className="p-1.5 text-tertiary hover:text-red-500 transition-colors"
                                            >
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                            {options.length < 6 && (
                                <button
                                    type="button"
                                    onClick={addOption}
                                    className="mt-3 inline-flex items-center gap-1.5 text-xs text-emerald-500 hover:text-emerald-400 transition-colors"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                    Ajouter une option
                                </button>
                            )}
                        </section>
                    </div>

                    {/* Side Column - shows first on mobile */}
                    <div className="space-y-4 sm:space-y-5 order-1 lg:order-2">
                        {/* Deadline - Important so shown first on mobile */}
                        <section className="bg-card border border-zinc-200 dark:border-white/5 rounded-lg p-4 sm:p-5">
                            <div className="flex items-center gap-2 mb-3">
                                <Calendar className="w-4 h-4 text-tertiary" />
                                <label className="text-xs font-medium text-tertiary">
                                    Date limite
                                </label>
                            </div>
                            <input
                                type="datetime-local"
                                value={deadline}
                                onChange={(e) => setDeadline(e.target.value)}
                                className="w-full px-3 py-2.5 sm:py-2 bg-background border border-zinc-200 dark:border-white/5 rounded-lg text-sm text-primary focus:outline-none focus:border-emerald-500/50 transition-colors"
                                required
                            />
                        </section>

                        {/* Pôle concerné */}
                        <section className="bg-card border border-zinc-200 dark:border-white/5 rounded-lg p-4 sm:p-5">
                            <div className="flex items-center gap-2 mb-3">
                                <Building2 className="w-4 h-4 text-tertiary" />
                                <label className="text-xs font-medium text-tertiary">
                                    Pôle concerné
                                </label>
                            </div>
                            <select
                                value={selectedPole}
                                onChange={(e) => setSelectedPole(e.target.value)}
                                className="w-full px-3 py-2.5 sm:py-2 bg-background border border-zinc-200 dark:border-white/5 rounded-lg text-sm text-primary focus:outline-none focus:border-emerald-500/50 transition-colors"
                            >
                                <option value="all">Toute l'équipe</option>
                                {poles.map((pole) => (
                                    <option key={pole.id} value={pole.id}>
                                        {pole.name}
                                    </option>
                                ))}
                            </select>
                            {selectedPole !== 'all' && (
                                <p className="text-xs text-tertiary mt-2">
                                    {poles.find(p => p.id === selectedPole)?.description}
                                </p>
                            )}
                        </section>

                        {/* Participants */}
                        <section className="bg-card border border-zinc-200 dark:border-white/5 rounded-lg p-4 sm:p-5">
                            <div className="flex items-center gap-2 mb-3">
                                <Users className="w-4 h-4 text-tertiary" />
                                <label className="text-xs font-medium text-tertiary">
                                    Participants ({selectedParticipants.length})
                                </label>
                            </div>
                            {selectedPole !== 'all' && (
                                <p className="text-xs text-amber-600 dark:text-amber-400 mb-2 flex items-center gap-1.5">
                                    <span className="w-1 h-1 rounded-full bg-amber-500"></span>
                                    Filtré par pôle
                                </p>
                            )}
                            <div className="grid grid-cols-2 sm:grid-cols-1 gap-1 max-h-48 overflow-y-auto">
                                {teamMembers
                                    .filter(member => 
                                        selectedPole === 'all' || member.poleId === selectedPole
                                    )
                                    .map((member) => (
                                        <label
                                            key={member.id}
                                            className="flex items-center gap-2 py-2 sm:py-1.5 px-2 rounded hover:bg-zinc-50 dark:hover:bg-white/5 cursor-pointer transition-colors"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedParticipants.includes(member.id)}
                                                onChange={() => toggleParticipant(member.id)}
                                                className="w-4 sm:w-3.5 h-4 sm:h-3.5 rounded border-zinc-300 dark:border-white/20 bg-background text-emerald-500 focus:ring-emerald-500/20"
                                            />
                                            <Avatar
                                                firstName={member.firstName}
                                                lastName={member.lastName}
                                                color={member.avatarColor}
                                                size="xs"
                                            />
                                            <span className="text-xs text-primary truncate">
                                                {member.firstName}
                                            </span>
                                        </label>
                                    ))}
                            </div>
                        </section>

                        {/* Submit Button - Sticky on mobile */}
                        <div className="lg:sticky lg:top-4">
                            <button
                                type="submit"
                                className="w-full py-3 sm:py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white font-medium rounded-lg transition-colors"
                            >
                                Lancer la décision
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};
