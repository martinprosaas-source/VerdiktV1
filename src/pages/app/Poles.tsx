import { useState } from 'react';
import { Plus, Users, MoreVertical, Edit, Trash, X, Check } from 'lucide-react';
import { Avatar } from '../../components/app/feedback/Avatar';
import { poles, users, teamMembers } from '../../data/mockData';
import type { Pole } from '../../types';

const getPoleColor = (color: string) => {
    const colors: Record<string, string> = {
        purple: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
        pink: 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20',
        blue: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
        emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
        orange: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
        cyan: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
        yellow: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20',
        red: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
    };
    return colors[color] || colors.blue;
};

export const Poles = () => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingPole, setEditingPole] = useState<Pole | null>(null);
    const [newPoleName, setNewPoleName] = useState('');
    const [newPoleDescription, setNewPoleDescription] = useState('');
    const [newPoleColor, setNewPoleColor] = useState('blue');
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

    const getMembersForPole = (poleId: string) => {
        return users.filter(user => user.poleId === poleId);
    };

    const handleCreatePole = () => {
        setIsCreateModalOpen(false);
        setNewPoleName('');
        setNewPoleDescription('');
        setNewPoleColor('blue');
        setSelectedMembers([]);
    };

    const handleEditPole = (pole: Pole) => {
        setEditingPole(pole);
        setNewPoleName(pole.name);
        setNewPoleDescription(pole.description);
        setNewPoleColor(pole.color);
        setSelectedMembers(pole.memberIds);
    };

    const handleSaveEdit = () => {
        setEditingPole(null);
        setNewPoleName('');
        setNewPoleDescription('');
        setNewPoleColor('blue');
        setSelectedMembers([]);
    };

    const toggleMember = (userId: string) => {
        setSelectedMembers(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    const colorOptions = [
        { value: 'purple', label: 'Violet', colorClass: 'bg-purple-500' },
        { value: 'pink', label: 'Rose', colorClass: 'bg-pink-500' },
        { value: 'blue', label: 'Bleu', colorClass: 'bg-blue-500' },
        { value: 'emerald', label: 'Émeraude', colorClass: 'bg-emerald-500' },
        { value: 'orange', label: 'Orange', colorClass: 'bg-orange-500' },
        { value: 'cyan', label: 'Cyan', colorClass: 'bg-cyan-500' },
        { value: 'yellow', label: 'Jaune', colorClass: 'bg-yellow-500' },
        { value: 'red', label: 'Rouge', colorClass: 'bg-red-500' },
    ];

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div>
                    <h1 className="text-lg sm:text-xl font-semibold text-primary">Pôles</h1>
                    <p className="text-sm text-tertiary">
                        {poles.length} pôles • {users.length} membres
                    </p>
                </div>
                <button 
                    onClick={() => setIsCreateModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 sm:py-1.5 bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-medium rounded-lg transition-colors"
                >
                    <Plus className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Nouveau pôle</span>
                </button>
            </div>

            {/* Poles Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {poles.map((pole) => {
                    const members = getMembersForPole(pole.id);
                    return (
                        <div 
                            key={pole.id}
                            className="bg-card border border-zinc-200 dark:border-white/5 rounded-lg p-5"
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-base font-semibold text-primary">
                                            {pole.name}
                                        </h3>
                                        <span className={`px-2 py-0.5 text-xs font-medium rounded border ${getPoleColor(pole.color)}`}>
                                            {members.length} {members.length > 1 ? 'membres' : 'membre'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-tertiary">
                                        {pole.description}
                                    </p>
                                </div>
                                <button 
                                    onClick={() => handleEditPole(pole)}
                                    className="p-1.5 text-tertiary hover:text-primary transition-colors rounded hover:bg-zinc-100 dark:hover:bg-white/5"
                                >
                                    <MoreVertical className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Members List */}
                            <div className="space-y-2">
                                {members.length === 0 ? (
                                    <div className="text-center py-4 text-tertiary">
                                        <Users className="w-6 h-6 mx-auto mb-1 opacity-50" />
                                        <p className="text-xs">Aucun membre dans ce pôle</p>
                                    </div>
                                ) : (
                                    members.map((member) => (
                                        <div 
                                            key={member.id}
                                            className="flex items-center gap-2.5 p-2 rounded hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors"
                                        >
                                            <Avatar 
                                                firstName={member.firstName}
                                                lastName={member.lastName}
                                                color={member.avatarColor}
                                                size="xs"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-primary truncate">
                                                    {member.firstName} {member.lastName}
                                                </p>
                                                <p className="text-xs text-tertiary">
                                                    {member.role === 'owner' ? 'Owner' : member.role === 'admin' ? 'Admin' : 'Membre'}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Create/Edit Modal */}
            {(isCreateModalOpen || editingPole) && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-card border border-zinc-200 dark:border-white/5 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-5 border-b border-zinc-200 dark:border-white/5 sticky top-0 bg-card z-10">
                            <h2 className="text-lg font-semibold text-primary">
                                {editingPole ? 'Modifier le pôle' : 'Nouveau pôle'}
                            </h2>
                            <button 
                                onClick={() => {
                                    setIsCreateModalOpen(false);
                                    setEditingPole(null);
                                    setNewPoleName('');
                                    setNewPoleDescription('');
                                    setSelectedMembers([]);
                                }}
                                className="p-1 text-tertiary hover:text-primary transition-colors rounded"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-5 space-y-5">
                            {/* Nom du pôle */}
                            <div>
                                <label className="block text-xs font-medium text-tertiary mb-2">
                                    Nom du pôle *
                                </label>
                                <input
                                    type="text"
                                    value={newPoleName}
                                    onChange={(e) => setNewPoleName(e.target.value)}
                                    placeholder="ex: Pôle Marketing & Communication"
                                    className="w-full px-3 py-2 bg-background border border-zinc-200 dark:border-white/5 rounded-lg text-sm text-primary placeholder:text-tertiary focus:outline-none focus:border-emerald-500/50 transition-colors"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-xs font-medium text-tertiary mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={newPoleDescription}
                                    onChange={(e) => setNewPoleDescription(e.target.value)}
                                    placeholder="Décrivez le rôle de ce pôle..."
                                    rows={3}
                                    className="w-full px-3 py-2 bg-background border border-zinc-200 dark:border-white/5 rounded-lg text-sm text-primary placeholder:text-tertiary focus:outline-none focus:border-emerald-500/50 transition-colors resize-none"
                                />
                            </div>

                            {/* Couleur */}
                            <div>
                                <label className="block text-xs font-medium text-tertiary mb-2">
                                    Couleur
                                </label>
                                <div className="grid grid-cols-4 gap-2">
                                    {colorOptions.map((color) => (
                                        <button
                                            key={color.value}
                                            type="button"
                                            onClick={() => setNewPoleColor(color.value)}
                                            className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                                                newPoleColor === color.value
                                                    ? 'border-emerald-500 bg-emerald-500/5'
                                                    : 'border-zinc-200 dark:border-white/5 hover:bg-zinc-50 dark:hover:bg-white/5'
                                            }`}
                                        >
                                            <div className={`w-4 h-4 rounded-full ${color.colorClass}`}></div>
                                            <span className="text-xs text-primary">{color.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Membres */}
                            <div>
                                <label className="block text-xs font-medium text-tertiary mb-2">
                                    Membres ({selectedMembers.length} sélectionnés)
                                </label>
                                <div className="border border-zinc-200 dark:border-white/5 rounded-lg max-h-64 overflow-y-auto">
                                    {teamMembers.map((member) => (
                                        <label
                                            key={member.id}
                                            className="flex items-center gap-3 p-3 hover:bg-zinc-50 dark:hover:bg-white/5 cursor-pointer transition-colors border-b border-zinc-200 dark:border-white/5 last:border-0"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedMembers.includes(member.id)}
                                                onChange={() => toggleMember(member.id)}
                                                className="w-4 h-4 rounded border-zinc-300 dark:border-white/20 bg-background text-emerald-500 focus:ring-emerald-500/20"
                                            />
                                            <Avatar
                                                firstName={member.firstName}
                                                lastName={member.lastName}
                                                color={member.avatarColor}
                                                size="xs"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-primary truncate">
                                                    {member.firstName} {member.lastName}
                                                </p>
                                                <p className="text-xs text-tertiary">
                                                    {member.email}
                                                </p>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex items-center justify-end gap-3 p-5 border-t border-zinc-200 dark:border-white/5 sticky bottom-0 bg-card">
                            <button 
                                onClick={() => {
                                    setIsCreateModalOpen(false);
                                    setEditingPole(null);
                                    setNewPoleName('');
                                    setNewPoleDescription('');
                                    setSelectedMembers([]);
                                }}
                                className="px-4 py-2 text-sm text-tertiary hover:text-primary transition-colors"
                            >
                                Annuler
                            </button>
                            <button 
                                onClick={editingPole ? handleSaveEdit : handleCreatePole}
                                disabled={!newPoleName.trim()}
                                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
                            >
                                <Check className="w-4 h-4" />
                                {editingPole ? 'Enregistrer' : 'Créer le pôle'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
