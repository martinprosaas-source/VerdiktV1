import type { User, Team, Decision, CurrentUser, Notification, AuditLogEntry, DecisionTemplate, TeamAnalytics, PendingInvite, Pole } from '../types';

// ============================================
// PÔLES : Organisation par départements
// ============================================

export const poles: Pole[] = [
    {
        id: 'pole-1',
        name: 'Pôle Marketing & Communication',
        description: 'Stratégie marketing, communication, acquisition clients',
        color: 'purple',
        memberIds: ['2', '6', '9'],
        createdAt: new Date('2024-01-15'),
    },
    {
        id: 'pole-2',
        name: 'Pôle Design & Créa',
        description: 'Design produit, identité visuelle, UX/UI',
        color: 'pink',
        memberIds: ['3', '4', '5', '10'],
        createdAt: new Date('2024-01-15'),
    },
    {
        id: 'pole-3',
        name: 'Pôle Tech & Produit',
        description: 'Développement, infrastructure, produit',
        color: 'blue',
        memberIds: ['7', '8', '11', '12'],
        createdAt: new Date('2024-01-15'),
    },
    {
        id: 'pole-4',
        name: 'Pôle Ops & Finance',
        description: 'Opérations, finance, RH, juridique',
        color: 'emerald',
        memberIds: ['1', '13'],
        createdAt: new Date('2024-01-15'),
    },
];

// ============================================
// ÉQUIPE : Stellar - Agence digitale en croissance
// 16 personnes, fondée il y a 3 ans, en pleine scale
// ============================================

export const users: User[] = [
    {
        id: '1',
        firstName: 'Camille',
        lastName: 'Durand',
        email: 'camille@stellar.agency',
        role: 'owner',
        avatarColor: 'emerald',
        poleId: 'pole-4',
        createdAt: new Date('2023-03-15'),
    },
    {
        id: '2',
        firstName: 'Lucas',
        lastName: 'Martin',
        email: 'lucas@stellar.agency',
        role: 'admin',
        avatarColor: 'blue',
        poleId: 'pole-1',
        createdAt: new Date('2023-04-01'),
    },
    {
        id: '3',
        firstName: 'Emma',
        lastName: 'Bernard',
        email: 'emma@stellar.agency',
        role: 'admin',
        avatarColor: 'purple',
        poleId: 'pole-2',
        createdAt: new Date('2023-06-15'),
    },
    {
        id: '4',
        firstName: 'Hugo',
        lastName: 'Petit',
        email: 'hugo@stellar.agency',
        role: 'member',
        avatarColor: 'orange',
        poleId: 'pole-2',
        createdAt: new Date('2023-09-01'),
    },
    {
        id: '5',
        firstName: 'Léa',
        lastName: 'Moreau',
        email: 'lea@stellar.agency',
        role: 'member',
        avatarColor: 'pink',
        poleId: 'pole-2',
        createdAt: new Date('2024-01-10'),
    },
    {
        id: '6',
        firstName: 'Nathan',
        lastName: 'Garcia',
        email: 'nathan@stellar.agency',
        role: 'member',
        avatarColor: 'cyan',
        poleId: 'pole-1',
        createdAt: new Date('2024-03-01'),
    },
    {
        id: '7',
        firstName: 'Chloé',
        lastName: 'Roux',
        email: 'chloe@stellar.agency',
        role: 'member',
        avatarColor: 'yellow',
        poleId: 'pole-3',
        createdAt: new Date('2024-06-15'),
    },
    {
        id: '8',
        firstName: 'Théo',
        lastName: 'Fournier',
        email: 'theo@stellar.agency',
        role: 'member',
        avatarColor: 'red',
        poleId: 'pole-3',
        createdAt: new Date('2024-09-01'),
    },
    {
        id: '9',
        firstName: 'Sophie',
        lastName: 'Dubois',
        email: 'sophie@stellar.agency',
        role: 'member',
        avatarColor: 'indigo',
        poleId: 'pole-1',
        createdAt: new Date('2024-10-15'),
    },
    {
        id: '10',
        firstName: 'Maxime',
        lastName: 'Laurent',
        email: 'maxime@stellar.agency',
        role: 'member',
        avatarColor: 'teal',
        poleId: 'pole-2',
        createdAt: new Date('2024-11-01'),
    },
    {
        id: '11',
        firstName: 'Julie',
        lastName: 'Simon',
        email: 'julie@stellar.agency',
        role: 'member',
        avatarColor: 'violet',
        poleId: 'pole-3',
        createdAt: new Date('2025-01-10'),
    },
    {
        id: '12',
        firstName: 'Alexandre',
        lastName: 'Michel',
        email: 'alex@stellar.agency',
        role: 'member',
        avatarColor: 'rose',
        poleId: 'pole-3',
        createdAt: new Date('2025-02-01'),
    },
    {
        id: '13',
        firstName: 'Marion',
        lastName: 'Lefevre',
        email: 'marion@stellar.agency',
        role: 'member',
        avatarColor: 'amber',
        poleId: 'pole-4',
        createdAt: new Date('2025-03-15'),
    },
];

// Camille est la fondatrice
export const currentUser: CurrentUser = {
    ...users[0],
    teamId: 'team-1',
};

export const teamMembers = users.map(user => ({
    ...user,
    joinedAt: user.createdAt
}));

// Invitations en attente
export const pendingInvites: PendingInvite[] = [
    {
        id: 'invite-1',
        email: 'sarah.lecomte@gmail.com',
        role: 'member',
        invitedById: '1',
        invitedBy: users[0],
        invitedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5),
    },
    {
        id: 'invite-2',
        email: 'antoine.mercier@freelance.com',
        role: 'member',
        invitedById: '2',
        invitedBy: users[1],
        invitedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4),
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
    },
];

// Équipe
export const team: Team = {
    id: 'team-1',
    name: 'Stellar',
    slug: 'stellar',
    members: users,
    createdAt: new Date('2023-03-15'),
};

// Templates de décisions
export const decisionTemplates: DecisionTemplate[] = [
    {
        id: 'template-hiring',
        name: 'Recrutement',
        description: 'Pour les décisions de recrutement et d\'embauche',
        icon: 'UserPlus',
        defaultOptions: ['Recruter', 'Ne pas recruter', 'Reporter'],
        suggestedContext: 'Profil du candidat :\n- \n\nExpérience :\n- \n\nPoints forts :\n- \n\nPoints de vigilance :\n- ',
    },
    {
        id: 'template-feature',
        name: 'Feature Priority',
        description: 'Prioriser une fonctionnalité produit',
        icon: 'Zap',
        defaultOptions: ['Priorité haute', 'Priorité moyenne', 'Priorité basse', 'Pas maintenant'],
        suggestedContext: 'Fonctionnalité :\n\nBénéfices attendus :\n- \n\nEffort estimé :\n\nImpact utilisateur :',
    },
    {
        id: 'template-budget',
        name: 'Budget',
        description: 'Décisions d\'investissement et de budget',
        icon: 'DollarSign',
        defaultOptions: ['Approuver', 'Refuser', 'Demander plus d\'infos'],
        suggestedContext: 'Montant demandé :\n\nObjet de la dépense :\n\nROI attendu :\n\nAlternatives considérées :',
    },
    {
        id: 'template-process',
        name: 'Process',
        description: 'Changements de processus internes',
        icon: 'GitBranch',
        defaultOptions: ['Adopter', 'Tester d\'abord', 'Refuser'],
        suggestedContext: 'Changement proposé :\n\nProblème actuel :\n\nBénéfices attendus :\n\nImpact sur l\'équipe :',
    },
    {
        id: 'template-tool',
        name: 'Choix d\'outil',
        description: 'Sélection d\'un nouvel outil ou service',
        icon: 'Wrench',
        defaultOptions: ['Option A', 'Option B', 'Option C', 'Aucun pour l\'instant'],
        suggestedContext: 'Besoin identifié :\n\nOptions considérées :\n- Option A : \n- Option B : \n- Option C : \n\nCritères de choix :\n- ',
    },
    {
        id: 'template-strategy',
        name: 'Stratégie',
        description: 'Décisions stratégiques et orientation',
        icon: 'Target',
        defaultOptions: ['Valider', 'Modifier', 'Rejeter', 'À creuser'],
        suggestedContext: 'Contexte stratégique :\n\nObjectifs visés :\n- \n\nRisques identifiés :\n- \n\nAlternatives :',
    },
    {
        id: 'template-partnership',
        name: 'Partenariat',
        description: 'Évaluer un partenariat ou collaboration',
        icon: 'Handshake',
        defaultOptions: ['Accepter', 'Négocier', 'Refuser'],
        suggestedContext: 'Partenaire potentiel :\n\nProposition :\n\nBénéfices mutuels :\n- \n\nConditions clés :',
    },
    {
        id: 'template-event',
        name: 'Événement',
        description: 'Organisation ou participation à un événement',
        icon: 'Calendar',
        defaultOptions: ['Participer', 'Sponsoriser', 'Observer', 'Passer'],
        suggestedContext: 'Événement :\n\nDate et lieu :\n\nCoût estimé :\n\nObjectifs de participation :',
    },
    {
        id: 'template-policy',
        name: 'Politique interne',
        description: 'Règles et politiques d\'équipe',
        icon: 'Shield',
        defaultOptions: ['Adopter', 'Adapter', 'Reporter', 'Rejeter'],
        suggestedContext: 'Politique proposée :\n\nRaison du changement :\n\nImpact sur l\'équipe :\n\nMise en œuvre prévue :',
    },
];

// Notifications
export const notifications: Notification[] = [
    {
        id: 'notif-1',
        type: 'vote_cast',
        title: 'Nouveau vote',
        message: 'Lucas a voté sur "Passer en full remote ou garder le bureau ?"',
        userId: '2',
        user: users[1],
        decisionId: 'decision-1',
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 15),
    },
    {
        id: 'notif-2',
        type: 'argument_added',
        title: 'Nouvel argument',
        message: 'Emma a ajouté un argument sur "Augmenter nos tarifs de 20% ?"',
        userId: '3',
        user: users[2],
        decisionId: 'decision-2',
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    },
    {
        id: 'notif-3',
        type: 'deadline_reminder',
        title: 'Deadline proche',
        message: '"Recruter un DA senior ou deux juniors ?" se termine demain',
        userId: '1',
        decisionId: 'decision-3',
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4),
    },
];

// Audit Log - Historique des actions
export const auditLog: AuditLogEntry[] = [
    {
        id: 'audit-1',
        action: 'vote_cast',
        userId: '2',
        user: users[1],
        decisionId: 'decision-1',
        details: 'Lucas a voté "Full remote" sur "Passer en full remote ou garder le bureau ?"',
        createdAt: new Date(Date.now() - 1000 * 60 * 15),
    },
    {
        id: 'audit-2',
        action: 'argument_added',
        userId: '3',
        user: users[2],
        decisionId: 'decision-2',
        details: 'Emma a ajouté un argument en faveur de l\'augmentation tarifaire',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    },
    {
        id: 'audit-3',
        action: 'decision_created',
        userId: '1',
        user: users[0],
        decisionId: 'decision-3',
        details: 'Camille a créé la décision "Recruter un DA senior ou deux juniors ?"',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    },
    {
        id: 'audit-4',
        action: 'decision_completed',
        userId: '1',
        user: users[0],
        decisionId: 'decision-4',
        details: 'La décision "HubSpot ou Pipedrive pour le CRM ?" a été conclue',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    },
    {
        id: 'audit-5',
        action: 'member_invited',
        userId: '1',
        user: users[0],
        details: 'Camille a invité Théo Fournier dans l\'équipe',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    },
    {
        id: 'audit-6',
        action: 'decision_completed',
        userId: '2',
        user: users[1],
        decisionId: 'decision-5',
        details: 'La décision "Accepter le projet Carrefour ?" a été conclue',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
    },
    {
        id: 'audit-7',
        action: 'member_role_changed',
        userId: '1',
        user: users[0],
        details: 'Camille a promu Emma au rôle d\'admin',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14),
    },
    {
        id: 'audit-8',
        action: 'decision_completed',
        userId: '1',
        user: users[0],
        decisionId: 'decision-6',
        details: 'La décision "Lancer notre offre SaaS ?" a été conclue',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 21),
    },
];

// Analytics - Stats impressionnantes mais crédibles
export const teamAnalytics: TeamAnalytics = {
    totalDecisions: 84,
    completedDecisions: 79,
    averageParticipationRate: 94,
    averageTimeToDecision: 4, // 4 heures en moyenne (le selling point !)
    decisionsThisMonth: 12,
    decisionsLastMonth: 9,
    participationByMember: [
        { userId: '1', user: users[0], votesCount: 82, argumentsCount: 45, decisionsCreated: 34 },
        { userId: '2', user: users[1], votesCount: 78, argumentsCount: 52, decisionsCreated: 22 },
        { userId: '3', user: users[2], votesCount: 75, argumentsCount: 38, decisionsCreated: 18 },
        { userId: '4', user: users[3], votesCount: 68, argumentsCount: 24, decisionsCreated: 8 },
        { userId: '5', user: users[4], votesCount: 54, argumentsCount: 19, decisionsCreated: 6 },
        { userId: '6', user: users[5], votesCount: 42, argumentsCount: 15, decisionsCreated: 4 },
        { userId: '7', user: users[6], votesCount: 28, argumentsCount: 11, decisionsCreated: 3 },
        { userId: '8', user: users[7], votesCount: 18, argumentsCount: 8, decisionsCreated: 2 },
        { userId: '9', user: users[8], votesCount: 14, argumentsCount: 6, decisionsCreated: 1 },
        { userId: '10', user: users[9], votesCount: 12, argumentsCount: 5, decisionsCreated: 1 },
        { userId: '11', user: users[10], votesCount: 8, argumentsCount: 4, decisionsCreated: 1 },
        { userId: '12', user: users[11], votesCount: 6, argumentsCount: 3, decisionsCreated: 0 },
        { userId: '13', user: users[12], votesCount: 15, argumentsCount: 7, decisionsCreated: 2 },
    ],
    decisionsByMonth: [
        { month: 'Sept', count: 8 },
        { month: 'Oct', count: 11 },
        { month: 'Nov', count: 14 },
        { month: 'Déc', count: 10 },
        { month: 'Jan', count: 12 },
    ],
};

// ============================================
// DÉCISIONS - Le cœur de l'application
// Mix de décisions actives et complétées
// Sujets universels que tout manager reconnaît
// ============================================

export const decisions: Decision[] = [
    // ========== DÉCISIONS ACTIVES ==========
    {
        id: 'decision-1',
        title: 'Passer en full remote ou garder le bureau ?',
        context: `Notre bail arrive à échéance dans 3 mois. On doit décider si on renouvelle ou non.

**Contexte :**
- Loyer actuel : 4 200€/mois (50 400€/an)
- L'équipe travaille déjà 3j/semaine en remote
- Taux de présence moyen au bureau : 40%

**Options à considérer :**
- Full remote : économie de 50k€/an, budget coworking ponctuel
- Garder le bureau : maintenir la culture d'équipe, espace client
- Hybride avec bureau plus petit : compromis à 2 500€/mois`,
        creatorId: '1',
        creator: users[0],
        options: [
            { id: 'opt-1-1', label: 'Full remote', votes: 4, voters: ['2', '4', '6', '8'] },
            { id: 'opt-1-2', label: 'Garder le bureau', votes: 2, voters: ['3', '5'] },
            { id: 'opt-1-3', label: 'Bureau plus petit', votes: 1, voters: ['7'] },
        ],
        participants: users,
        arguments: [
            {
                id: 'arg-1-1',
                userId: '2',
                user: users[1],
                optionId: 'opt-1-1',
                text: '50k€ d\'économie c\'est un recrutement. Et on travaille mieux de chez nous, les chiffres le prouvent.',
                createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
            },
            {
                id: 'arg-1-2',
                userId: '3',
                user: users[2],
                optionId: 'opt-1-2',
                text: 'Les brainstorms créatifs en visio c\'est pas pareil. Et pour les clients, avoir un bureau ça fait pro.',
                createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4),
            },
            {
                id: 'arg-1-3',
                userId: '4',
                user: users[3],
                optionId: 'opt-1-1',
                text: 'On peut louer des salles pour les workshops clients. Ça coûtera 10x moins cher.',
                createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
            },
            {
                id: 'arg-1-4',
                userId: '7',
                user: users[6],
                optionId: 'opt-1-3',
                text: 'Un petit bureau de 4-5 postes pour ceux qui veulent + les réunions clients, ça peut être un bon compromis.',
                createdAt: new Date(Date.now() - 1000 * 60 * 30),
            },
        ],
        deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        status: 'active',
        poleId: 'pole-4', // Pôle Ops & Finance
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    },
    {
        id: 'decision-2',
        title: 'Augmenter nos tarifs de 20% ?',
        context: `On n'a pas touché à nos prix depuis 2 ans. Entre temps :

**Ce qui a changé :**
- Nos coûts ont augmenté de 25% (salaires, outils, infra)
- Notre expertise a progressé (3 gros projets livrés)
- Le marché a bougé (+15% en moyenne chez les concurrents)

**Nos tarifs actuels :**
- TJM senior : 650€ → proposition 780€
- TJM junior : 450€ → proposition 540€
- Forfait site vitrine : 8 000€ → proposition 9 600€

**Risque identifié :** 2-3 clients historiques pourraient mal le prendre.`,
        creatorId: '3',
        creator: users[2],
        options: [
            { id: 'opt-2-1', label: 'Oui, +20% pour tous', votes: 3, voters: ['1', '3', '5'] },
            { id: 'opt-2-2', label: 'Oui, mais +10% seulement', votes: 2, voters: ['2', '6'] },
            { id: 'opt-2-3', label: 'Non, garder les prix', votes: 0, voters: [] },
        ],
        participants: users.slice(0, 6),
        arguments: [
            {
                id: 'arg-2-1',
                userId: '1',
                user: users[0],
                optionId: 'opt-2-1',
                text: 'On sous-facture depuis trop longtemps. +20% nous remet juste au niveau du marché.',
                createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8),
            },
            {
                id: 'arg-2-2',
                userId: '2',
                user: users[1],
                optionId: 'opt-2-2',
                text: '+10% c\'est plus digeste pour les clients. On peut monter progressivement.',
                createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
            },
            {
                id: 'arg-2-3',
                userId: '3',
                user: users[2],
                optionId: 'opt-2-1',
                text: 'Les nouveaux clients accepteront les nouveaux tarifs. Pour les anciens, on peut proposer un palier.',
                createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
            },
        ],
        deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        status: 'active',
        poleId: 'pole-1', // Pôle Marketing & Communication
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    },
    {
        id: 'decision-3',
        title: 'Recruter un DA senior ou deux juniors ?',
        context: `On a 3 projets qui arrivent et l'équipe design est sous l'eau.

**Budget disponible :** 75-80k€ brut annuel

**Option A - 1 DA Senior (75k€) :**
- Autonome immédiatement
- Peut gérer les projets complexes
- Apporte de l'expérience à l'équipe

**Option B - 2 DA Juniors (38k€ x 2) :**
- Plus de bras pour les projets
- Besoin de formation/encadrement
- Risque de turnover plus élevé

**Contexte équipe actuelle :** Emma (lead), Hugo et Léa (mids)`,
        creatorId: '1',
        creator: users[0],
        options: [
            { id: 'opt-3-1', label: '1 DA Senior', votes: 2, voters: ['1', '3'] },
            { id: 'opt-3-2', label: '2 DA Juniors', votes: 1, voters: ['4'] },
            { id: 'opt-3-3', label: 'Attendre / Freelance', votes: 0, voters: [] },
        ],
        participants: users.slice(0, 5),
        arguments: [
            {
                id: 'arg-3-1',
                userId: '3',
                user: users[2],
                optionId: 'opt-3-1',
                text: 'J\'ai pas la bande passante pour former 2 juniors. Un senior qui peut tourner en autonomie, c\'est ce qu\'il nous faut.',
                createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
            },
            {
                id: 'arg-3-2',
                userId: '4',
                user: users[3],
                optionId: 'opt-3-2',
                text: 'Deux juniors motivés, bien formés, ça peut dépoter. Et c\'est un investissement long terme.',
                createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8),
            },
        ],
        deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        status: 'active',
        poleId: 'pole-2', // Pôle Design & Créa
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    },
    {
        id: 'decision-8',
        title: 'Migrer notre stack vers Next.js 15 ?',
        context: `Notre application React actuelle commence à montrer des limites en performance.

**Avantages Next.js 15 :**
- Server Components pour de meilleures perfs
- Meilleur SEO natif
- Routing optimisé
- Image optimization intégrée

**Inconvénients :**
- 2-3 semaines de migration
- Courbe d'apprentissage pour l'équipe
- Risque de bugs en production

**Alternative :** Optimiser l'existant avec lazy loading et code splitting`,
        creatorId: '7',
        creator: users[6],
        options: [
            { id: 'opt-8-1', label: 'Migrer vers Next.js', votes: 2, voters: ['7', '11'] },
            { id: 'opt-8-2', label: 'Optimiser l\'existant', votes: 1, voters: ['8'] },
            { id: 'opt-8-3', label: 'Évaluer d\'abord', votes: 0, voters: [] },
        ],
        participants: [users[6], users[7], users[10], users[11]],
        arguments: [
            {
                id: 'arg-8-1',
                userId: '7',
                user: users[6],
                optionId: 'opt-8-1',
                text: 'Next.js 15 est stable maintenant. Les gains de performance vont nous aider à scaler.',
                createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
            },
            {
                id: 'arg-8-2',
                userId: '8',
                user: users[7],
                optionId: 'opt-8-2',
                text: 'On a beaucoup de dette technique à régler. Migrer maintenant va juste ajouter de la complexité.',
                createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1),
            },
        ],
        deadline: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        status: 'active',
        poleId: 'pole-3', // Pôle Tech & Produit
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8),
    },
    {
        id: 'decision-9',
        title: 'Refonte complète de notre identité visuelle ?',
        context: `Notre logo et charte graphique ont 3 ans. On a beaucoup évolué.

**Pourquoi maintenant :**
- Notre positionnement a changé (plus premium)
- Le design actuel fait "startup early stage"
- Opportunité de se démarquer

**Budget estimé :**
- Refonte complète : 15-20k€ (agence externe)
- Interne : 3-4 semaines Emma + équipe design
- Hybrid : 8k€ + 2 semaines interne

**Impact :** Site web, docs, réseaux sociaux, templates clients`,
        creatorId: '3',
        creator: users[2],
        options: [
            { id: 'opt-9-1', label: 'Refonte complète externe', votes: 1, voters: ['1'] },
            { id: 'opt-9-2', label: 'Faire en interne', votes: 2, voters: ['3', '4'] },
            { id: 'opt-9-3', label: 'Hybride', votes: 1, voters: ['5'] },
        ],
        participants: [users[0], users[2], users[3], users[4], users[9]],
        arguments: [
            {
                id: 'arg-9-1',
                userId: '3',
                user: users[2],
                optionId: 'opt-9-2',
                text: 'On a les compétences en interne. Autant investir ce budget ailleurs et contrôler le processus.',
                createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
            },
            {
                id: 'arg-9-2',
                userId: '1',
                user: users[0],
                optionId: 'opt-9-1',
                text: 'Un regard externe peut apporter une vraie disruption. Et ça libère l\'équipe pour les projets clients.',
                createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
            },
        ],
        deadline: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
        status: 'active',
        poleId: 'pole-2', // Pôle Design & Créa
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18),
    },

    // ========== DÉCISIONS COMPLÉTÉES ==========
    {
        id: 'decision-4',
        title: 'HubSpot ou Pipedrive pour le CRM ?',
        context: `Notre Excel de suivi clients ne scale plus. On doit passer sur un vrai CRM.

**Nos besoins :**
- Suivi pipeline commercial (environ 30 leads/mois)
- Historique des échanges clients
- Intégration email + calendrier

**Options étudiées :**
- HubSpot Free → Pro à 90€/mois si on scale
- Pipedrive à 49€/mois (essentiel)
- Notion + Zapier (DIY)`,
        creatorId: '2',
        creator: users[1],
        options: [
            { id: 'opt-4-1', label: 'HubSpot', votes: 5, voters: ['1', '2', '3', '5', '6'] },
            { id: 'opt-4-2', label: 'Pipedrive', votes: 2, voters: ['4', '7'] },
            { id: 'opt-4-3', label: 'Notion DIY', votes: 0, voters: [] },
        ],
        participants: users.slice(0, 7),
        arguments: [
            {
                id: 'arg-4-1',
                userId: '2',
                user: users[1],
                optionId: 'opt-4-1',
                text: 'HubSpot gratuit pour commencer, et l\'écosystème marketing est top pour plus tard.',
                createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
            },
            {
                id: 'arg-4-2',
                userId: '4',
                user: users[3],
                optionId: 'opt-4-2',
                text: 'Pipedrive est plus simple et fait exactement ce qu\'on veut. Pas besoin d\'usine à gaz.',
                createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4),
            },
        ],
        deadline: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
        status: 'completed',
        completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
        aiSummary: {
            result: '5 voix sur 7 pour HubSpot',
            winningOption: 'HubSpot',
            mainArguments: [
                {
                    option: 'HubSpot',
                    arguments: [
                        'Version gratuite suffisante pour démarrer',
                        'Écosystème marketing complet pour évoluer',
                        'Meilleure intégration email native',
                    ],
                },
                {
                    option: 'Pipedrive',
                    arguments: [
                        'Interface plus simple et directe',
                        'Prix fixe prévisible',
                    ],
                },
            ],
            concerns: [
                'Prévoir une formation équipe de 2h',
                'Migrer les contacts Excel proprement',
            ],
            recommendation: 'Démarrer sur HubSpot Free, migrer les contacts existants, et réévaluer dans 6 mois si besoin de passer Pro.',
        },
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    },
    {
        id: 'decision-5',
        title: 'Accepter le projet Carrefour ?',
        context: `Carrefour nous propose un projet de refonte de leur portail interne.

**Le projet :**
- Budget : 85 000€
- Durée : 4 mois
- Équipe nécessaire : 3 personnes à 80%

**Points positifs :**
- Grosse référence pour le portfolio
- Budget confortable
- Potentiel de projets récurrents

**Points de vigilance :**
- Timeline serrée
- Process validation lourds (grand groupe)
- Risque de bloquer d'autres projets`,
        creatorId: '1',
        creator: users[0],
        options: [
            { id: 'opt-5-1', label: 'Accepter', votes: 5, voters: ['1', '2', '3', '4', '6'] },
            { id: 'opt-5-2', label: 'Négocier le délai', votes: 2, voters: ['5', '7'] },
            { id: 'opt-5-3', label: 'Refuser', votes: 0, voters: [] },
        ],
        participants: users.slice(0, 7),
        arguments: [
            {
                id: 'arg-5-1',
                userId: '1',
                user: users[0],
                optionId: 'opt-5-1',
                text: 'Carrefour dans notre portfolio, ça ouvre des portes. On trouve les ressources.',
                createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12),
            },
            {
                id: 'arg-5-2',
                userId: '5',
                user: users[4],
                optionId: 'opt-5-2',
                text: '4 mois c\'est court pour ce scope. Si on négocie 5 mois, c\'est jouable sereinement.',
                createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 11),
            },
        ],
        deadline: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
        status: 'completed',
        completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
        aiSummary: {
            result: '5 voix pour accepter, 2 pour négocier le délai',
            winningOption: 'Accepter',
            mainArguments: [
                {
                    option: 'Accepter',
                    arguments: [
                        'Référence stratégique pour le portfolio',
                        'Budget confortable avec bonne marge',
                        'Opportunité de récurrence',
                    ],
            },
            {
                    option: 'Négocier le délai',
                    arguments: [
                        'Timeline serrée = risque de qualité',
                        'Un mois de plus sécuriserait la livraison',
                    ],
                },
            ],
            concerns: [
                'Anticiper les process de validation grand groupe',
                'Sanctuariser l\'équipe projet',
            ],
            recommendation: 'Accepter le projet en proposant un planning avec marges intégrées. Prévoir un point hebdo avec le client pour fluidifier les validations.',
        },
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14),
    },
    {
        id: 'decision-6',
        title: 'Lancer notre offre SaaS en beta ?',
        context: `On a développé en interne un outil de gestion de projet. Plusieurs clients nous ont demandé s'ils pouvaient l'utiliser.

**L'outil :**
- Gestion de projet simplifiée
- Déjà utilisé en interne depuis 8 mois
- Retours positifs de l'équipe

**Questions :**
- Est-ce qu'on lance en beta publique ?
- Quel pricing ? Freemium ou payant direct ?
- Qui gère le support ?`,
        creatorId: '1',
        creator: users[0],
        options: [
            { id: 'opt-6-1', label: 'Lancer en beta gratuite', votes: 4, voters: ['1', '2', '5', '6'] },
            { id: 'opt-6-2', label: 'Beta payante (50€/mois)', votes: 2, voters: ['3', '4'] },
            { id: 'opt-6-3', label: 'Reporter / Focus agence', votes: 1, voters: ['7'] },
        ],
        participants: users.slice(0, 7),
        arguments: [
            {
                id: 'arg-6-1',
                userId: '1',
                user: users[0],
                optionId: 'opt-6-1',
                text: 'Beta gratuite pour avoir du feedback et valider le product-market fit avant de monétiser.',
                createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 23),
            },
            {
                id: 'arg-6-2',
                userId: '3',
                user: users[2],
                optionId: 'opt-6-2',
                text: 'Si c\'est gratuit, les gens ne prennent pas au sérieux. 50€/mois ça filtre les vrais intéressés.',
                createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 22),
            },
            {
                id: 'arg-6-3',
                userId: '7',
                user: users[6],
                optionId: 'opt-6-3',
                text: 'On a déjà beaucoup à gérer avec l\'agence. Un SaaS c\'est un autre métier.',
                createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 22),
            },
        ],
        deadline: new Date(Date.now() - 1000 * 60 * 60 * 24 * 21),
        status: 'completed',
        completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 21),
        poleId: 'pole-3', // Pôle Tech & Produit
        aiSummary: {
            result: '4 voix pour beta gratuite, 2 pour beta payante, 1 pour reporter',
            winningOption: 'Lancer en beta gratuite',
            mainArguments: [
                {
                    option: 'Lancer en beta gratuite',
                    arguments: [
                        'Permet de valider le product-market fit',
                        'Collecte de feedback sans friction',
                        'Construit une base d\'early adopters',
                    ],
                },
                {
                    option: 'Beta payante',
                    arguments: [
                        'Filtre les utilisateurs sérieux',
                        'Valide la willingness to pay',
                    ],
                },
            ],
            concerns: [
                'Définir une limite de temps pour la beta (3 mois max)',
                'Prévoir qui gère le support',
            ],
            recommendation: 'Lancer en beta gratuite limitée à 50 utilisateurs pendant 3 mois. Collecter du feedback structuré et définir le pricing avant la sortie officielle.',
        },
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 25),
    },
    {
        id: 'decision-7',
        title: 'Sponsoriser la conférence WebSummit ?',
        context: `On nous propose un stand sponsor au WebSummit Lisbon.

**L'offre :**
- Pack Startup : 8 500€
- Inclut : stand 6m², 4 badges, listing catalogue
- Dates : 11-14 novembre

**Potentiel :**
- Visibilité internationale
- Networking avec startups/investisseurs
- Recrutement potentiel

**Contraintes :**
- Budget marketing annuel : 25 000€
- Mobilise 2 personnes pendant 4 jours`,
        creatorId: '2',
        creator: users[1],
        options: [
            { id: 'opt-7-1', label: 'Oui, on y va', votes: 2, voters: ['2', '6'] },
            { id: 'opt-7-2', label: 'Non, trop cher', votes: 4, voters: ['1', '3', '4', '5'] },
        ],
        participants: users.slice(0, 6),
        arguments: [
            {
                id: 'arg-7-1',
                userId: '2',
                user: users[1],
                optionId: 'opt-7-1',
                text: 'C\'est LA conf tech en Europe. Pour notre image et le SaaS qu\'on lance, c\'est stratégique.',
                createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 32),
            },
            {
                id: 'arg-7-2',
                userId: '1',
                user: users[0],
                optionId: 'opt-7-2',
                text: '8 500€ + transport + hôtel = 12k€. C\'est 50% du budget marketing pour un ROI incertain.',
                createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 31),
            },
        ],
        deadline: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
        status: 'completed',
        completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
        poleId: 'pole-1', // Pôle Marketing & Communication
        aiSummary: {
            result: '4 voix contre, 2 pour',
            winningOption: 'Non, trop cher',
            mainArguments: [
                {
                    option: 'Non, trop cher',
                    arguments: [
                        'Représente 50% du budget marketing annuel',
                        'ROI difficile à mesurer',
                        'Mieux d\'investir dans du contenu/SEO',
                    ],
                },
                {
                    option: 'Oui, on y va',
                    arguments: [
                        'Visibilité internationale',
                        'Bon timing avec le lancement SaaS',
                    ],
                },
            ],
            concerns: [
                'Réévaluer pour l\'année prochaine si le SaaS décolle',
            ],
            recommendation: 'Reporter à l\'année prochaine. Investir le budget dans des actions marketing à ROI plus mesurable (content, ads ciblés).',
        },
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 35),
    },
];

// Helper functions
export const getDecisionById = (id: string): Decision | undefined => {
    return decisions.find(d => d.id === id);
};

export const getUserById = (id: string): User | undefined => {
    return users.find(u => u.id === id);
};

export const getActiveDecisions = (): Decision[] => {
    return decisions.filter(d => d.status === 'active');
};

export const getCompletedDecisions = (): Decision[] => {
    return decisions.filter(d => d.status === 'completed' || d.status === 'archived');
};

export const getPendingVotesCount = (userId: string): number => {
    return decisions.filter(d => {
        if (d.status !== 'active') return false;
        const hasVoted = d.options.some(opt => opt.voters.includes(userId));
        return !hasVoted;
    }).length;
};

export const getDecisionsThisMonth = (): number => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    return decisions.filter(d => new Date(d.createdAt) >= startOfMonth).length;
};

export const getPoleById = (id: string): Pole | undefined => {
    return poles.find(p => p.id === id);
};

export const getMembersInPole = (poleId: string): User[] => {
    return users.filter(u => u.poleId === poleId);
};
