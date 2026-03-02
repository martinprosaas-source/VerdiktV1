// Types pour l'application Verdikt

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: 'owner' | 'admin' | 'member';
    avatarColor?: string;
    poleId?: string;
    createdAt: Date;
}

export interface Pole {
    id: string;
    name: string;
    description: string;
    color: string;
    memberIds: string[];
    createdAt: Date;
}

export interface Team {
    id: string;
    name: string;
    slug: string;
    members: User[];
    createdAt: Date;
}

export interface VoteOption {
    id: string;
    label: string;
    votes: number;
    voters: string[]; // User IDs
}

export interface Argument {
    id: string;
    userId: string;
    user: User;
    optionId: string;
    text: string;
    mentions?: string[]; // User IDs mentioned with @
    createdAt: Date;
}

export interface AISummary {
    result: string;
    winningOption: string;
    mainArguments: {
        option: string;
        arguments: string[];
    }[];
    concerns: string[];
    recommendation: string;
}

export interface Decision {
    id: string;
    title: string;
    context: string;
    creatorId: string;
    creator: User;
    options: VoteOption[];
    participants: User[];
    arguments: Argument[];
    deadline: Date;
    status: 'active' | 'completed' | 'archived';
    aiSummary?: AISummary;
    createdAt: Date;
    completedAt?: Date;
    templateId?: string;
    poleId?: string; // Pôle concerné par la décision
}

export interface CurrentUser extends User {
    teamId: string;
}

// Notifications
export type NotificationType = 
    | 'new_decision'
    | 'vote_cast'
    | 'decision_completed'
    | 'deadline_reminder'
    | 'mention'
    | 'argument_added'
    | 'member_joined';

export interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    userId: string; // Who triggered
    user?: User;
    decisionId?: string;
    read: boolean;
    createdAt: Date;
}

// Audit Log
export type AuditActionType = 
    | 'decision_created'
    | 'decision_completed'
    | 'vote_cast'
    | 'vote_changed'
    | 'argument_added'
    | 'deadline_changed'
    | 'participant_added'
    | 'member_invited'
    | 'member_role_changed'
    | 'settings_changed';

export interface AuditLogEntry {
    id: string;
    action: AuditActionType;
    userId: string;
    user: User;
    decisionId?: string;
    decision?: Decision;
    details: string;
    metadata?: Record<string, unknown>;
    createdAt: Date;
}

// Templates
export interface DecisionTemplate {
    id: string;
    name: string;
    description: string;
    icon: string;
    defaultOptions: string[];
    suggestedContext: string;
}

// Pending Invites
export interface PendingInvite {
    id: string;
    email: string;
    role: 'admin' | 'member';
    invitedById: string;
    invitedBy: User;
    invitedAt: Date;
    expiresAt: Date;
}

// Analytics
export interface TeamAnalytics {
    totalDecisions: number;
    completedDecisions: number;
    averageParticipationRate: number;
    averageTimeToDecision: number; // in hours
    decisionsThisMonth: number;
    decisionsLastMonth: number;
    participationByMember: {
        userId: string;
        user: User;
        votesCount: number;
        argumentsCount: number;
        decisionsCreated: number;
    }[];
    decisionsByMonth: {
        month: string;
        count: number;
    }[];
}
