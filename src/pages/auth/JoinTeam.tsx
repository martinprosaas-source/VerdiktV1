import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Users } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Logo } from '../../components/Logo';

export const JoinTeam = () => {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [teamName, setTeamName] = useState('');
    const [inviterName, setInviterName] = useState('');
    const [role, setRole] = useState('member');
    const [isLoading, setIsLoading] = useState(false);
    const [initLoading, setInitLoading] = useState(true);
    const [error, setError] = useState('');
    const [invitedTeamId, setInvitedTeamId] = useState('');

    useEffect(() => {
        const init = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) { navigate('/login'); return; }

                const meta = user.user_metadata || {};
                if (!meta.invited_team_id) { navigate('/onboarding'); return; }

                setInvitedTeamId(meta.invited_team_id);
                setRole(meta.invited_role || 'member');

                // Fetch team name
                const { data: team } = await supabase
                    .from('teams')
                    .select('name')
                    .eq('id', meta.invited_team_id)
                    .single();

                if (team?.name) setTeamName(team.name);

                // Fetch inviter name
                if (meta.invited_by) {
                    const { data: inviter } = await supabase
                        .from('users')
                        .select('first_name, last_name')
                        .eq('id', meta.invited_by)
                        .single();

                    if (inviter) {
                        setInviterName(`${inviter.first_name || ''} ${inviter.last_name || ''}`.trim());
                    }
                }
            } catch (e) {
                console.error('JoinTeam init error:', e);
            } finally {
                setInitLoading(false);
            }
        };

        init();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!firstName.trim()) { setError('Prénom requis'); return; }

        setIsLoading(true);
        setError('');

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Non authentifié');

            // Create user profile with team
            const { error: upsertError } = await supabase
                .from('users')
                .upsert({
                    id: user.id,
                    email: user.email!,
                    first_name: firstName.trim(),
                    last_name: lastName.trim() || null,
                    team_id: invitedTeamId,
                    role,
                }, { onConflict: 'id' });

            if (upsertError) throw upsertError;

            // Mark onboarding as complete (invited users skip onboarding)
            const { error: metaError } = await supabase.auth.updateUser({
                data: { onboarding_completed: true },
            });

            if (metaError) throw metaError;

            navigate('/app');
        } catch (err: any) {
            setError(err.message || 'Une erreur est survenue. Veuillez réessayer.');
        } finally {
            setIsLoading(false);
        }
    };

    if (initLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <Logo size="lg" linkTo="/" />
                    </div>

                    {/* Team badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-4">
                        <Users className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-xs font-medium text-emerald-500">
                            {teamName || 'Équipe Verdikt'}
                        </span>
                    </div>

                    <h1 className="text-2xl font-bold text-primary mb-2">
                        Rejoindre{' '}
                        <span className="text-emerald-500">{teamName || 'l\'équipe'}</span>
                    </h1>
                    <p className="text-secondary text-sm">
                        {inviterName
                            ? `${inviterName} vous invite à collaborer sur Verdikt.`
                            : 'Finalisez votre profil pour accéder à votre espace de travail.'}
                    </p>
                </div>

                {/* Card */}
                <div className="bg-card border border-border-subtle/20 rounded-2xl p-8 shadow-xl">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-secondary mb-1.5">
                                    Prénom <span className="text-emerald-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    placeholder="Jean"
                                    autoFocus
                                    className="w-full px-3 py-2.5 bg-background border border-border-subtle/30 rounded-lg text-sm text-primary placeholder:text-tertiary focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-secondary mb-1.5">
                                    Nom
                                </label>
                                <input
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    placeholder="Dupont"
                                    className="w-full px-3 py-2.5 bg-background border border-border-subtle/30 rounded-lg text-sm text-primary placeholder:text-tertiary focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                                />
                            </div>
                        </div>

                        {/* Role info */}
                        <div className="flex items-center gap-2 px-3 py-2.5 bg-zinc-50 dark:bg-white/[0.03] border border-border-subtle/20 rounded-lg">
                            <span className="text-xs text-secondary">Rôle dans l'équipe :</span>
                            <span className="text-xs font-semibold text-primary capitalize">
                                {role === 'admin' ? 'Admin' : 'Membre'}
                            </span>
                        </div>

                        {error && (
                            <p className="text-red-400 text-sm">{error}</p>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading || !firstName.trim()}
                            className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Finalisation...
                                </span>
                            ) : (
                                'Accéder à mon espace →'
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-xs text-tertiary text-center mt-4">
                    Vous pouvez définir votre mot de passe depuis les Paramètres.
                </p>
            </div>
        </div>
    );
};
