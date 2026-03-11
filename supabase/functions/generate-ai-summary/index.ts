import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
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
        const { decision_id } = await req.json();
        if (!decision_id) throw new Error('decision_id is required');

        const supabase = createClient(
            Deno.env.get('SUPABASE_URL')!,
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
        );

        // Skip if summary already exists
        const { data: existing } = await supabase
            .from('decisions')
            .select('ai_summary, status')
            .eq('id', decision_id)
            .single();

        if (existing?.ai_summary) {
            return new Response(JSON.stringify({ summary: existing.ai_summary }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }

        // Fetch decision + options
        const { data: decision, error: decisionError } = await supabase
            .from('decisions')
            .select('title, context, vote_options(id, label)')
            .eq('id', decision_id)
            .single();

        if (decisionError || !decision) throw new Error('Decision not found');

        // Fetch votes + arguments in parallel
        const [votesResult, argsResult] = await Promise.all([
            supabase
                .from('votes')
                .select('option_id')
                .eq('decision_id', decision_id),
            supabase
                .from('arguments')
                .select('text, option_id')
                .eq('decision_id', decision_id),
        ]);

        // Build vote counts per option
        const voteCounts: Record<string, number> = {};
        for (const v of (votesResult.data || [])) {
            voteCounts[v.option_id] = (voteCounts[v.option_id] || 0) + 1;
        }
        const totalVotes = Object.values(voteCounts).reduce((a, b) => a + b, 0);

        const optionMap: Record<string, string> = {};
        for (const opt of (decision.vote_options || [])) {
            optionMap[opt.id] = opt.label;
        }

        const optionsWithVotes = (decision.vote_options || [])
            .map((opt: { id: string; label: string }) => ({
                label: opt.label,
                votes: voteCounts[opt.id] || 0,
                percentage: totalVotes > 0
                    ? Math.round(((voteCounts[opt.id] || 0) / totalVotes) * 100)
                    : 0,
            }))
            .sort((a: { votes: number }, b: { votes: number }) => b.votes - a.votes);

        // Group arguments by option
        const argsByOption: Record<string, string[]> = {};
        for (const arg of (argsResult.data || [])) {
            const label = optionMap[arg.option_id] || 'autre';
            if (!argsByOption[label]) argsByOption[label] = [];
            argsByOption[label].push(arg.text);
        }

        const argsText = Object.entries(argsByOption)
            .map(([label, texts]) =>
                `Option "${label}":\n${texts.map(t => `  • ${t}`).join('\n')}`
            )
            .join('\n\n');

        // Build prompt
        const prompt = `Tu es un analyste de décisions d'équipe. Analyse cette décision et génère une synthèse structurée.

DÉCISION: "${decision.title}"
${decision.context ? `CONTEXTE: ${decision.context}` : ''}

RÉSULTATS DU VOTE (${totalVotes} vote${totalVotes > 1 ? 's' : ''} au total):
${optionsWithVotes.map((o: { label: string; votes: number; percentage: number }) => `• ${o.label}: ${o.votes} vote${o.votes > 1 ? 's' : ''} (${o.percentage}%)`).join('\n')}

${argsText ? `ARGUMENTS PARTAGÉS:\n${argsText}` : 'Aucun argument partagé par les participants.'}

Génère une synthèse JSON avec EXACTEMENT cette structure (réponds uniquement avec le JSON brut, sans markdown) :
{
  "result": "Phrase courte décrivant le résultat: quelle option a gagné et avec quel score",
  "recommendation": "Recommandation concrète et actionnelle basée sur les votes et arguments (2-3 phrases). Mentionne les points de consensus et les prochaines étapes suggérées.",
  "concerns": ["Point d'attention ou risque 1", "Point d'attention ou risque 2"]
}

Règles:
- "result" : 1 phrase factuelle max
- "recommendation" : 2-3 phrases, ton professionnel, orienté action
- "concerns" : 0 à 3 éléments, seulement s'il y a de vraies tensions ou risques détectés
- Réponds dans la même langue que la décision (français ou anglais)`;

        const anthropicKey = Deno.env.get('ANTHROPIC_API_KEY');
        if (!anthropicKey) throw new Error('ANTHROPIC_API_KEY secret not configured');

        const claudeRes = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'x-api-key': anthropicKey,
                'anthropic-version': '2023-06-01',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'claude-haiku-4-5',
                max_tokens: 600,
                messages: [{ role: 'user', content: prompt }],
            }),
        });

        if (!claudeRes.ok) {
            const errText = await claudeRes.text();
            throw new Error(`Anthropic error: ${claudeRes.status} — ${errText}`);
        }

        const aiData = await claudeRes.json();
        const rawContent: string = aiData.content?.[0]?.text?.trim() || '{}';

        let summary: { result: string; recommendation: string; concerns: string[] };
        try {
            summary = JSON.parse(rawContent);
        } catch {
            summary = {
                result: optionsWithVotes[0]
                    ? `${optionsWithVotes[0].label} l'emporte avec ${optionsWithVotes[0].percentage}% des votes.`
                    : 'Aucun vote enregistré.',
                recommendation: rawContent,
                concerns: [],
            };
        }

        // Save to DB
        const { error: updateError } = await supabase
            .from('decisions')
            .update({ ai_summary: summary })
            .eq('id', decision_id);

        if (updateError) throw updateError;

        return new Response(JSON.stringify({ summary }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error('generate-ai-summary error:', message);
        return new Response(JSON.stringify({ error: message }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
});
