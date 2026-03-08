import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

export interface Integration {
    id: string;
    team_id: string;
    provider: string;
    channel_id: string | null;
    channel_name: string | null;
    workspace_name: string | null;
    settings: Record<string, any>;
    connected_by: string | null;
    created_at: string;
    updated_at: string;
}

export const useIntegrations = () => {
    const { profile } = useAuth();
    const [integrations, setIntegrations] = useState<Integration[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchIntegrations = useCallback(async () => {
        if (!profile?.team_id) return;

        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('team_integrations')
                .select('id, team_id, provider, channel_id, channel_name, workspace_name, settings, connected_by, created_at, updated_at')
                .eq('team_id', profile.team_id);

            if (error) throw error;
            setIntegrations(data || []);
        } catch (error) {
            console.error('Error fetching integrations:', error);
        } finally {
            setLoading(false);
        }
    }, [profile?.team_id]);

    useEffect(() => {
        if (profile?.team_id) {
            fetchIntegrations();
        } else {
            setLoading(false);
        }
    }, [profile?.team_id, fetchIntegrations]);

    const getIntegration = (provider: string) => {
        return integrations.find(i => i.provider === provider) || null;
    };

    const connectSlack = async () => {
        if (!profile?.team_id || !profile?.id) return;

        try {
            const { data, error } = await supabase.functions.invoke('slack-oauth', {
                body: { team_id: profile.team_id, user_id: profile.id },
            });

            if (error) throw error;
            if (data?.url) {
                window.location.href = data.url;
            }
        } catch (error) {
            console.error('Error starting Slack OAuth:', error);
            throw error;
        }
    };

    const connectNotion = async () => {
        if (!profile?.team_id || !profile?.id) return;

        try {
            const { data, error } = await supabase.functions.invoke('notion-oauth', {
                body: { team_id: profile.team_id, user_id: profile.id },
            });

            if (error) throw error;
            if (data?.url) {
                window.location.href = data.url;
            }
        } catch (error) {
            console.error('Error starting Notion OAuth:', error);
            throw error;
        }
    };

    const disconnectIntegration = async (provider: string) => {
        if (!profile?.team_id) return;

        try {
            const { error } = await supabase
                .from('team_integrations')
                .delete()
                .eq('team_id', profile.team_id)
                .eq('provider', provider);

            if (error) throw error;
            await fetchIntegrations();
        } catch (error) {
            console.error('Error disconnecting integration:', error);
            throw error;
        }
    };

    const updateSettings = async (provider: string, settings: Record<string, any>) => {
        if (!profile?.team_id) return;

        try {
            const integration = getIntegration(provider);
            if (!integration) return;

            const { error } = await supabase
                .from('team_integrations')
                .update({
                    settings: { ...integration.settings, ...settings },
                })
                .eq('team_id', profile.team_id)
                .eq('provider', provider);

            if (error) throw error;
            await fetchIntegrations();
        } catch (error) {
            console.error('Error updating integration settings:', error);
            throw error;
        }
    };

    return {
        integrations,
        loading,
        getIntegration,
        connectSlack,
        connectNotion,
        disconnectIntegration,
        updateSettings,
        refetch: fetchIntegrations,
    };
};
