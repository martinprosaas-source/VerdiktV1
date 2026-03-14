import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const { question, language = 'fr', templateContext, templateOptions } = await req.json();
        if (!question?.trim()) throw new Error('question is required');

        const anthropicKey = Deno.env.get('ANTHROPIC_API_KEY');
        if (!anthropicKey) throw new Error('ANTHROPIC_API_KEY secret not configured');

        const lang = language === 'en' ? 'English' : 'French';

        const hasTemplate = templateContext?.trim();

        const templateBlock = hasTemplate
            ? `\nThe team is using a decision template with the following pre-filled framework:\n\nContext structure:\n${templateContext.trim()}\n\nDefault vote options: ${(templateOptions || []).join(', ')}\n\nIMPORTANT: Use this template framework to generate a FILLED-IN context. Replace the empty fields/placeholders with concrete, relevant content based on the question. Keep the same structure and headings but fill them with useful details the team needs. You can refine or replace the vote options if the question calls for it.`
            : '';

        const prompt = `You are an expert decision-making facilitator. A team member wants to make a decision and typed this question:

"${question.trim()}"${templateBlock}

Generate a structured decision framework to help the team decide. Respond ONLY with raw JSON (no markdown, no code fences):

{
  "context": "A structured, filled-in context paragraph or bullet points",
  "options": ["Option 1", "Option 2", "Option 3"],
  "criteria": ["Criterion 1", "Criterion 2", "Criterion 3"]
}

Rules:
- "context": ${hasTemplate ? 'Fill in the template structure with concrete details relevant to the question. Keep headings/labels, replace blanks with useful content.' : 'Concise, relevant, helps the team understand what\'s at stake'}
- "options": 2-4 concrete, actionable options. Not vague. Use short labels.${hasTemplate ? ' You may keep, adapt, or replace the template defaults based on the question.' : ''}
- "criteria": 2-4 evaluation criteria the team should weigh when voting
- Respond in ${lang}
- Keep everything short and practical`;

        const claudeRes = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'x-api-key': anthropicKey,
                'anthropic-version': '2023-06-01',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'claude-haiku-4-5',
                max_tokens: 400,
                messages: [{ role: 'user', content: prompt }],
            }),
        });

        if (!claudeRes.ok) {
            const errText = await claudeRes.text();
            throw new Error(`Anthropic error: ${claudeRes.status} — ${errText}`);
        }

        const aiData = await claudeRes.json();
        const rawContent: string = aiData.content?.[0]?.text?.trim() || '{}';

        const fence = String.fromCharCode(96, 96, 96);
        const cleaned = rawContent
            .replace(new RegExp('^' + fence + '(?:json)?\\s*', 'i'), '')
            .replace(new RegExp('\\s*' + fence + '$', 'i'), '')
            .trim();

        let structure: { context: string; options: string[]; criteria: string[] };
        try {
            structure = JSON.parse(cleaned);
        } catch {
            throw new Error('Failed to parse AI response');
        }

        if (!structure.context || !Array.isArray(structure.options) || !Array.isArray(structure.criteria)) {
            throw new Error('Invalid AI response structure');
        }

        return new Response(JSON.stringify(structure), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error('structure-decision error:', message);
        return new Response(JSON.stringify({ error: message }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
});
