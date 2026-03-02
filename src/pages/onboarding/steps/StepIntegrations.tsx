import { useEffect } from 'react';
import { useOnboarding } from '../../../context/OnboardingContext';
import { Clock, Plug } from 'lucide-react';
import { SlackLogo, NotionLogo, GoogleCalendarLogo } from '../../../components/icons/IntegrationLogos';

const integrations = [
    {
        id: 'slack',
        name: 'Slack',
        description: 'Notifications et votes depuis Slack',
        icon: <SlackLogo className="w-6 h-6 object-contain" />,
        status: 'coming_soon' as const,
    },
    {
        id: 'notion',
        name: 'Notion',
        description: 'Synchronisez avec votre base Notion',
        icon: <NotionLogo className="w-6 h-6 object-contain" />,
        status: 'coming_soon' as const,
    },
    {
        id: 'google_calendar',
        name: 'Google Calendar',
        description: 'Ajoutez les deadlines au calendrier',
        icon: <GoogleCalendarLogo className="w-6 h-6 object-contain" />,
        status: 'coming_soon' as const,
    },
];

export const StepIntegrations = () => {
    const { setCanGoNext } = useOnboarding();

    // Cette étape est optionnelle, on peut toujours continuer
    useEffect(() => {
        setCanGoNext(true);
    }, [setCanGoNext]);

    return (
        <div className="space-y-6">
            {/* Info banner */}
            <div className="flex items-start gap-3 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
                <Plug className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div>
                    <p className="text-sm text-primary font-medium">Connectez vos outils préférés</p>
                    <p className="text-xs text-tertiary mt-1">
                        Intégrez Verdikt à votre workflow. Vous pourrez aussi le faire plus tard dans les paramètres.
                    </p>
                </div>
            </div>

            {/* Integrations list */}
            <div className="space-y-3">
                {integrations.map((integration) => (
                    <div
                        key={integration.id}
                        className="flex items-center justify-between p-4 bg-card border border-zinc-200 dark:border-white/5 rounded-xl hover:border-zinc-300 dark:hover:border-white/10 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-white/5 flex items-center justify-center">
                                {integration.icon}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-primary">{integration.name}</p>
                                <p className="text-xs text-tertiary">{integration.description}</p>
                            </div>
                        </div>

                        {integration.status === 'coming_soon' ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-500/10 rounded-lg">
                                <Clock className="w-3 h-3" />
                                Bientôt
                            </span>
                        ) : (
                            <button className="px-4 py-1.5 text-sm font-medium bg-emerald-500 hover:bg-emerald-400 text-white rounded-lg transition-colors">
                                Connecter
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {/* Skip hint */}
            <p className="text-xs text-center text-tertiary">
                Les intégrations arrivent bientôt ! Vous serez notifié dès leur disponibilité.
            </p>
        </div>
    );
};
