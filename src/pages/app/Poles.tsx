import { useState } from 'react';
import { Plus, Users, MoreVertical, X, Check, Loader2 } from 'lucide-react';
import { Avatar } from '../../components/app/feedback/Avatar';
import { useTranslation } from 'react-i18next';
import { usePoles, useTeam, useDelayedLoading, useAuth } from '../../hooks';

const getPoleColor = (hexColor: string) => {
    const colorMap: Record<string, string> = {
        '#a855f7': 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
        '#ec4899': 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20',
        '#3b82f6': 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
        '#10b981': 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
        '#f97316': 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
        '#06b6d4': 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
        '#eab308': 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20',
        '#ef4444': 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
    };
    return colorMap[hexColor] || colorMap['#3b82f6'];
};

export const Poles = () => {
    const { poles: polesData, loading, createPole, updatePole, deletePole } = usePoles();
    const { members, updateMember } = useTeam();
    const { canManage } = useAuth();
    const { t } = useTranslation();
    const showSpinner = useDelayedLoading(loading);
    
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingPole, setEditingPole] = useState<any | null>(null);
    const [newPoleName, setNewPoleName] = useState('');
    const [newPoleDescription, setNewPoleDescription] = useState('');
    const [newPoleColor, setNewPoleColor] = useState('#3b82f6');
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const getMembersForPole = (poleId: string) => {
        return members.filter(user => user.pole_id === poleId);
    };

    const handleCreatePole = async () => {
        if (!newPoleName.trim()) return;
        
        setIsSubmitting(true);
        try {
            const newPole = await createPole({
                name: newPoleName,
                description: newPoleDescription || null,
                color: newPoleColor,
            });

            // Update members if any selected
            if (newPole && selectedMembers.length > 0) {
                await Promise.all(
                    selectedMembers.map(memberId => 
                        updateMember(memberId, { pole_id: newPole.id })
                    )
                );
            }

            setIsCreateModalOpen(false);
            setNewPoleName('');
            setNewPoleDescription('');
            setNewPoleColor('#3b82f6');
            setSelectedMembers([]);
        } catch (error) {
            console.error('Error creating pole:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditPole = (pole: any) => {
        setEditingPole(pole);
        setNewPoleName(pole.name);
        setNewPoleDescription(pole.description || '');
        setNewPoleColor(pole.color);
        setSelectedMembers(getMembersForPole(pole.id).map(m => m.id));
    };

    const handleSaveEdit = async () => {
        if (!editingPole || !newPoleName.trim()) return;

        setIsSubmitting(true);
        try {
            await updatePole(editingPole.id, {
                name: newPoleName,
                description: newPoleDescription || null,
                color: newPoleColor,
            });

            // Update pole assignments for members
            const currentMembers = getMembersForPole(editingPole.id).map(m => m.id);
            const membersToAdd = selectedMembers.filter(id => !currentMembers.includes(id));
            const membersToRemove = currentMembers.filter(id => !selectedMembers.includes(id));

            await Promise.all([
                ...membersToAdd.map(id => updateMember(id, { pole_id: editingPole.id })),
                ...membersToRemove.map(id => updateMember(id, { pole_id: null })),
            ]);

            setEditingPole(null);
            setNewPoleName('');
            setNewPoleDescription('');
            setNewPoleColor('#3b82f6');
            setSelectedMembers([]);
        } catch (error) {
            console.error('Error updating pole:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeletePole = async (poleId: string) => {
        if (!confirm(t('app.poles.deleteConfirm'))) return;

        try {
            // First, remove pole assignment from all members
            const poleMembers = getMembersForPole(poleId);
            await Promise.all(
                poleMembers.map(member => updateMember(member.id, { pole_id: null }))
            );

            // Then delete the pole
            await deletePole(poleId);
        } catch (error) {
            console.error('Error deleting pole:', error);
        }
    };

    const toggleMember = (userId: string) => {
        setSelectedMembers(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    const colorOptions = [
        { value: '#a855f7', label: t('app.poles.modal.colors.purple'), colorClass: 'bg-purple-500' },
        { value: '#ec4899', label: t('app.poles.modal.colors.pink'), colorClass: 'bg-pink-500' },
        { value: '#3b82f6', label: t('app.poles.modal.colors.blue'), colorClass: 'bg-blue-500' },
        { value: '#10b981', label: t('app.poles.modal.colors.emerald'), colorClass: 'bg-emerald-500' },
        { value: '#f97316', label: t('app.poles.modal.colors.orange'), colorClass: 'bg-orange-500' },
        { value: '#06b6d4', label: t('app.poles.modal.colors.cyan'), colorClass: 'bg-cyan-500' },
        { value: '#eab308', label: t('app.poles.modal.colors.yellow'), colorClass: 'bg-yellow-500' },
        { value: '#ef4444', label: t('app.poles.modal.colors.red'), colorClass: 'bg-red-500' },
    ];

    if (showSpinner) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div>
                    <h1 className="text-lg sm:text-xl font-semibold text-primary">{t('app.poles.title')}</h1>
                    <p className="text-sm text-tertiary">
                        {t('app.poles.subtitle', { poles: polesData.length, members: members.length })}
                    </p>
                </div>
                {canManage && (
                    <button 
                        onClick={() => setIsCreateModalOpen(true)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 sm:py-1.5 bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">{t('app.poles.newPole')}</span>
                    </button>
                )}
            </div>

            {/* Poles Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {polesData.map((pole) => {
                    const poleMembers = getMembersForPole(pole.id);
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
                                            {t('app.poles.member', { count: poleMembers.length })}
                                        </span>
                                    </div>
                                    <p className="text-xs text-tertiary">
                                        {pole.description}
                                    </p>
                                </div>
                                {canManage && (
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => handleEditPole(pole)}
                                            className="p-1.5 text-tertiary hover:text-primary transition-colors rounded hover:bg-zinc-100 dark:hover:bg-white/5"
                                        >
                                            <MoreVertical className="w-4 h-4" />
                                        </button>
                                        <button 
                                            onClick={() => handleDeletePole(pole.id)}
                                            className="p-1.5 text-red-500 hover:text-red-600 transition-colors rounded hover:bg-red-500/10"
                                            title={t('app.poles.deletePole')}
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Members List */}
                            <div className="space-y-2">
                                {poleMembers.length === 0 ? (
                                    <div className="text-center py-4 text-tertiary">
                                        <Users className="w-6 h-6 mx-auto mb-1 opacity-50" />
                                        <p className="text-xs">{t('app.poles.noMembers')}</p>
                                    </div>
                                ) : (
                                    poleMembers.map((member) => (
                                        <div 
                                            key={member.id}
                                            className="flex items-center gap-2.5 p-2 rounded hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors"
                                        >
                                            <Avatar 
                                                firstName={member.first_name}
                                                lastName={member.last_name}
                                                color={member.avatar_color || undefined}
                                                size="xs"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-primary truncate">
                                                    {member.first_name} {member.last_name}
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
                                {editingPole ? t('app.poles.modal.editTitle') : t('app.poles.modal.createTitle')}
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
                                    {t('app.poles.modal.name')} *
                                </label>
                                <input
                                    type="text"
                                    value={newPoleName}
                                    onChange={(e) => setNewPoleName(e.target.value)}
                                    placeholder={t('app.poles.modal.namePlaceholder')}
                                    className="w-full px-3 py-2 bg-background border border-zinc-200 dark:border-white/5 rounded-lg text-sm text-primary placeholder:text-tertiary focus:outline-none focus:border-emerald-500/50 transition-colors"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-xs font-medium text-tertiary mb-2">
                                    {t('app.poles.modal.description')}
                                </label>
                                <textarea
                                    value={newPoleDescription}
                                    onChange={(e) => setNewPoleDescription(e.target.value)}
                                    placeholder={t('app.poles.modal.descPlaceholder')}
                                    rows={3}
                                    className="w-full px-3 py-2 bg-background border border-zinc-200 dark:border-white/5 rounded-lg text-sm text-primary placeholder:text-tertiary focus:outline-none focus:border-emerald-500/50 transition-colors resize-none"
                                />
                            </div>

                            {/* Couleur */}
                            <div>
                                <label className="block text-xs font-medium text-tertiary mb-2">
                                    {t('app.poles.modal.color')}
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
                                    {t('app.poles.modal.membersLabel', { count: selectedMembers.length })}
                                </label>
                                <div className="border border-zinc-200 dark:border-white/5 rounded-lg max-h-64 overflow-y-auto">
                                    {members.map((member) => (
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
                                                firstName={member.first_name}
                                                lastName={member.last_name}
                                                color={member.avatar_color || undefined}
                                                size="xs"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-primary truncate">
                                                    {member.first_name} {member.last_name}
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
                                {t('app.poles.modal.cancel')}
                            </button>
                            <button 
                                onClick={editingPole ? handleSaveEdit : handleCreatePole}
                                disabled={!newPoleName.trim() || isSubmitting}
                                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        {editingPole ? t('app.poles.modal.saving') : t('app.poles.modal.creating')}
                                    </>
                                ) : (
                                    <>
                                        <Check className="w-4 h-4" />
                                        {editingPole ? t('app.poles.modal.save') : t('app.poles.modal.create')}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
