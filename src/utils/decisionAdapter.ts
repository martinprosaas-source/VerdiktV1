// Helper to convert Supabase decision format to legacy Decision format for components
export const adaptDecisionForComponents = (supabaseDecision: any): any => {
    // Adapt options to include votes property (maps votes_count to votes)
    const adaptedOptions = (supabaseDecision.options || []).map((opt: any) => ({
        id: opt.id,
        label: opt.label,
        votes: opt.votes_count || 0,  // Map votes_count to votes
        voters: [],  // Empty array for now (would need to fetch from votes table)
    }));

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
        options: adaptedOptions,
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
