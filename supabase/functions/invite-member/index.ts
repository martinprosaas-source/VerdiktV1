import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
        const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

        if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
            return new Response(
                JSON.stringify({ error: 'missing_config', message: 'Configuration serveur manquante.' }),
                { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
            );
        }

        // Authenticate the caller
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) {
            return new Response(
                JSON.stringify({ error: 'unauthorized', message: 'Non authentifié.' }),
                { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
            );
        }

        const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

        // Verify caller's JWT and get their profile
        const callerClient = createClient(SUPABASE_URL, Deno.env.get('SUPABASE_ANON_KEY') || '', {
            global: { headers: { Authorization: authHeader } },
        });
        const { data: { user: caller }, error: callerError } = await callerClient.auth.getUser();

        if (callerError || !caller) {
            return new Response(
                JSON.stringify({ error: 'unauthorized', message: 'Token invalide.' }),
                { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
            );
        }

        // Get caller's profile to check permissions and team
        const { data: callerProfile } = await supabaseAdmin
            .from('users')
            .select('role, team_id')
            .eq('id', caller.id)
            .single();

        if (!callerProfile?.team_id) {
            return new Response(
                JSON.stringify({ error: 'no_team', message: 'Vous n\'appartenez pas à une équipe.' }),
                { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
            );
        }

        if (!['owner', 'admin'].includes(callerProfile.role)) {
            return new Response(
                JSON.stringify({ error: 'forbidden', message: 'Seuls les admins peuvent inviter des membres.' }),
                { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
            );
        }

        const { emails, role } = await req.json();

        if (!emails || !Array.isArray(emails) || emails.length === 0) {
            return new Response(
                JSON.stringify({ error: 'invalid_params', message: 'Emails requis.' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
            );
        }

        const validRole = ['admin', 'member'].includes(role) ? role : 'member';
        const FRONTEND_URL = Deno.env.get('FRONTEND_URL') || SUPABASE_URL.replace('.supabase.co', '.vercel.app');

        const results: { email: string; success: boolean; error?: string }[] = [];

        for (const email of emails) {
            try {
                const { error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
                    redirectTo: `${FRONTEND_URL}/app`,
                    data: {
                        invited_team_id: callerProfile.team_id,
                        invited_role: validRole,
                        invited_by: caller.id,
                    },
                });

                if (inviteError) {
                    results.push({ email, success: false, error: inviteError.message });
                } else {
                    results.push({ email, success: true });
                }
            } catch (err: any) {
                results.push({ email, success: false, error: err.message });
            }
        }

        const successCount = results.filter(r => r.success).length;

        return new Response(
            JSON.stringify({
                success: successCount > 0,
                sent: successCount,
                total: emails.length,
                results,
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
    } catch (err: any) {
        return new Response(
            JSON.stringify({ error: 'internal_error', message: err.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
    }
});
