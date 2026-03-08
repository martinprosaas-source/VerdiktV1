import { useEffect, useRef, useState } from 'react';
import { useOnboarding } from '../../../context/OnboardingContext';
import { User, Camera, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../../lib/supabase';

const roles = [
    { value: 'ceo', label: 'CEO / Founder' },
    { value: 'coo', label: 'COO / Ops' },
    { value: 'cto', label: 'CTO / Tech' },
    { value: 'vp_product', label: 'VP Product' },
    { value: 'manager', label: 'Manager' },
    { value: 'other', label: 'Autre' },
];

export const StepProfile = () => {
    const { data, updateData, setCanGoNext } = useOnboarding();
    const [isRoleOpen, setIsRoleOpen] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(data.avatar);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const prefilled = useRef(false);

    useEffect(() => {
        if (prefilled.current) return;
        prefilled.current = true;

        const prefillFromAuth = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const meta = user.user_metadata;
            if (!meta) return;

            const updates: Record<string, string> = {};

            if (!data.firstName && meta.full_name) {
                const parts = meta.full_name.split(' ');
                updates.firstName = parts[0] || '';
                if (parts.length > 1) updates.lastName = parts.slice(1).join(' ');
            }
            if (!data.firstName && meta.name) {
                const parts = meta.name.split(' ');
                updates.firstName = parts[0] || '';
                if (!updates.lastName && parts.length > 1) updates.lastName = parts.slice(1).join(' ');
            }

            if (meta.avatar_url && !data.avatar) {
                updates.avatar = meta.avatar_url;
                setPreviewUrl(meta.avatar_url);
            }

            if (Object.keys(updates).length > 0) updateData(updates);
        };

        prefillFromAuth();
    }, []);

    useEffect(() => {
        const isValid = data.firstName.trim() !== '' && data.role !== '';
        setCanGoNext(isValid);
    }, [data.firstName, data.role, setCanGoNext]);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            updateData({ avatar: url });
        }
    };

    const selectedRole = roles.find(r => r.value === data.role);

    return (
        <div className="space-y-6">
            {/* Avatar upload */}
            <div className="flex justify-center mb-8">
                <div className="relative">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => fileInputRef.current?.click()}
                        className="w-24 h-24 rounded-2xl bg-zinc-100 dark:bg-white/5 border-2 border-dashed border-zinc-300 dark:border-white/10 hover:border-emerald-500 cursor-pointer flex items-center justify-center overflow-hidden transition-colors"
                    >
                        {previewUrl ? (
                            <img src={previewUrl} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            <User className="w-10 h-10 text-tertiary" />
                        )}
                    </motion.div>
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg hover:bg-emerald-400 transition-colors"
                    >
                        <Camera className="w-4 h-4" />
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                    />
                </div>
            </div>
            <p className="text-center text-sm text-tertiary -mt-4 mb-6">
                Cliquez pour ajouter une photo (optionnel)
            </p>

            {/* First name */}
            <div>
                <label className="block text-sm font-medium text-primary mb-2">
                    Prénom <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    value={data.firstName}
                    onChange={(e) => updateData({ firstName: e.target.value })}
                    placeholder="Marie"
                    className="w-full px-4 py-3 bg-card border border-zinc-200 dark:border-white/10 rounded-xl text-primary placeholder:text-tertiary focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                />
            </div>

            {/* Last name */}
            <div>
                <label className="block text-sm font-medium text-primary mb-2">
                    Nom <span className="text-tertiary">(optionnel)</span>
                </label>
                <input
                    type="text"
                    value={data.lastName}
                    onChange={(e) => updateData({ lastName: e.target.value })}
                    placeholder="Laurent"
                    className="w-full px-4 py-3 bg-card border border-zinc-200 dark:border-white/10 rounded-xl text-primary placeholder:text-tertiary focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                />
            </div>

            {/* Role dropdown */}
            <div>
                <label className="block text-sm font-medium text-primary mb-2">
                    Votre rôle <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setIsRoleOpen(!isRoleOpen)}
                        className="w-full px-4 py-3 bg-card border border-zinc-200 dark:border-white/10 rounded-xl text-left flex items-center justify-between focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                    >
                        <span className={selectedRole ? 'text-primary' : 'text-tertiary'}>
                            {selectedRole?.label || 'Sélectionnez votre rôle'}
                        </span>
                        <ChevronDown className={`w-5 h-5 text-tertiary transition-transform ${isRoleOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    <AnimatePresence>
                        {isRoleOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute top-full left-0 right-0 mt-2 bg-card border border-zinc-200 dark:border-white/10 rounded-xl shadow-xl overflow-hidden z-10"
                            >
                                {roles.map((role) => (
                                    <button
                                        key={role.value}
                                        onClick={() => {
                                            updateData({ role: role.value });
                                            setIsRoleOpen(false);
                                        }}
                                        className={`w-full px-4 py-3 text-left hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors ${
                                            data.role === role.value ? 'text-emerald-500 bg-emerald-500/5' : 'text-primary'
                                        }`}
                                    >
                                        {role.label}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};
