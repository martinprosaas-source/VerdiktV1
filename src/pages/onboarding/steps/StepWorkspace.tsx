import { useEffect, useRef, useState } from 'react';
import { useOnboarding } from '../../../context/OnboardingContext';
import { Building2, Upload, Users, Lock, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

const teamSizes = [
    { value: '15-30', label: '15-30 personnes' },
    { value: '30-50', label: '30-50 personnes' },
    { value: '50-100', label: '50-100 personnes' },
    { value: '100+', label: '100+ personnes' },
];

export const StepWorkspace = () => {
    const { data, updateData, setCanGoNext } = useOnboarding();
    const [logoPreview, setLogoPreview] = useState<string | null>(data.logo);
    const [showPassword, setShowPassword] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const isPasswordValid = data.password.length >= 8;
        const isValid = data.teamName.trim() !== '' && data.teamSize !== '' && isPasswordValid;
        setCanGoNext(isValid);
    }, [data.teamName, data.teamSize, data.password, setCanGoNext]);

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setLogoPreview(url);
            updateData({ logo: url });
        }
    };

    const generateSlug = (name: string) => {
        return name.toLowerCase()
            .replace(/[àáâãäå]/g, 'a')
            .replace(/[èéêë]/g, 'e')
            .replace(/[ìíîï]/g, 'i')
            .replace(/[òóôõö]/g, 'o')
            .replace(/[ùúûü]/g, 'u')
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
    };

    return (
        <div className="space-y-6">
            {/* Logo upload */}
            <div>
                <label className="block text-sm font-medium text-primary mb-3">
                    Logo <span className="text-tertiary">(optionnel)</span>
                </label>
                <motion.div
                    whileHover={{ scale: 1.01 }}
                    onClick={() => fileInputRef.current?.click()}
                    className="relative border-2 border-dashed border-zinc-200 dark:border-white/10 hover:border-emerald-500 rounded-xl p-6 cursor-pointer transition-colors"
                >
                    <div className="flex items-center gap-4">
                        {logoPreview ? (
                            <img src={logoPreview} alt="Logo" className="w-16 h-16 rounded-xl object-contain bg-zinc-50 dark:bg-white/5" />
                        ) : (
                            <div className="w-16 h-16 rounded-xl bg-zinc-100 dark:bg-white/5 flex items-center justify-center">
                                <Building2 className="w-8 h-8 text-tertiary" />
                            </div>
                        )}
                        <div className="flex-1">
                            <p className="text-sm font-medium text-primary">
                                {logoPreview ? 'Changer le logo' : 'Ajouter un logo'}
                            </p>
                            <p className="text-xs text-tertiary">
                                PNG, JPG ou SVG. Max 2MB.
                            </p>
                        </div>
                        <Upload className="w-5 h-5 text-tertiary" />
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="hidden"
                    />
                </motion.div>
            </div>

            {/* Team name */}
            <div>
                <label className="block text-sm font-medium text-primary mb-2">
                    Nom de l'équipe <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    value={data.teamName}
                    onChange={(e) => updateData({ teamName: e.target.value })}
                    placeholder="Acme Inc."
                    className="w-full px-4 py-3 bg-card border border-zinc-200 dark:border-white/10 rounded-xl text-primary placeholder:text-tertiary focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                />
                
                {/* URL preview */}
                {data.teamName && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-3 p-3 bg-zinc-50 dark:bg-white/5 rounded-lg"
                    >
                        <p className="text-xs text-tertiary mb-1">Votre espace sera accessible à :</p>
                        <p className="text-sm font-mono">
                            <span className="text-secondary">verdikt.ai/</span>
                            <span className="text-emerald-500">{generateSlug(data.teamName)}</span>
                        </p>
                    </motion.div>
                )}
            </div>

            {/* Team size */}
            <div>
                <label className="block text-sm font-medium text-primary mb-3">
                    Taille de l'équipe <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                    {teamSizes.map((size) => (
                        <motion.button
                            key={size.value}
                            type="button"
                            onClick={() => updateData({ teamSize: size.value })}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`p-4 rounded-xl border text-left transition-all ${
                                data.teamSize === size.value
                                    ? 'border-emerald-500 bg-emerald-500/5 ring-2 ring-emerald-500/20'
                                    : 'border-zinc-200 dark:border-white/10 hover:border-zinc-300 dark:hover:border-white/20'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                    data.teamSize === size.value 
                                        ? 'bg-emerald-500/20 text-emerald-500' 
                                        : 'bg-zinc-100 dark:bg-white/5 text-tertiary'
                                }`}>
                                    <Users className="w-4 h-4" />
                                </div>
                                <span className={data.teamSize === size.value ? 'text-primary font-medium' : 'text-secondary'}>
                                    {size.label}
                                </span>
                            </div>
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Password */}
            <div>
                <label className="block text-sm font-medium text-primary mb-2">
                    Choisissez un mot de passe <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-tertiary" />
                    <input
                        type={showPassword ? 'text' : 'password'}
                        value={data.password}
                        onChange={(e) => updateData({ password: e.target.value })}
                        placeholder="Minimum 8 caractères"
                        className="w-full pl-11 pr-12 py-3 bg-card border border-zinc-200 dark:border-white/10 rounded-xl text-primary placeholder:text-tertiary focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-tertiary hover:text-secondary transition-colors"
                    >
                        {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                        ) : (
                            <Eye className="w-5 h-5" />
                        )}
                    </button>
                </div>
                {data.password && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-2"
                    >
                        <div className="flex items-center gap-2">
                            <div className={`h-1 flex-1 rounded-full transition-colors ${
                                data.password.length >= 8 ? 'bg-emerald-500' : 'bg-zinc-200 dark:bg-white/10'
                            }`} />
                        </div>
                        <p className={`text-xs mt-1 ${
                            data.password.length >= 8 ? 'text-emerald-500' : 'text-tertiary'
                        }`}>
                            {data.password.length >= 8 ? '✓ Mot de passe sécurisé' : `${8 - data.password.length} caractère${8 - data.password.length > 1 ? 's' : ''} restant${8 - data.password.length > 1 ? 's' : ''}`}
                        </p>
                    </motion.div>
                )}
            </div>
        </div>
    );
};
