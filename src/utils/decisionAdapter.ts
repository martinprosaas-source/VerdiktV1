// Helper to convert Supabase decision format to legacy Decision format for components
export const adaptDecisionForComponents = (supabaseDecision: any): any => {
    return {
        id: supabaseDecision.id,
        title: supabaseDecision.title,
        context: supabaseDecision.context,
        creatorId: supabaseDecision.creator_id,
        creator: {
            id: supabaseDecision.creator_id,
            firstName: supabaseDecision.creator?.first_name || '',
            lastName: supabaseDecision.creator?.last_name || '',
            email: supabaseDecision.creator?.email || '',
        },
        options: supabaseDecision.options || [],
        participants: [], // Placeholder - would need to fetch from decision_participants
        arguments: [], // Placeholder - would need to fetch from arguments table
        deadline: supabaseDecision.deadline,
        status: supabaseDecision.status,
        createdAt: supabaseDecision.created_at,
        completedAt: supabaseDecision.completed_at,
        templateId: supabaseDecision.template_id,
        poleId: supabaseDecision.pole_id,
    };
};
