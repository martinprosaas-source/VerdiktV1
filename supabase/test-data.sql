-- ============================================
-- SCRIPT DE DONNÉES DE TEST POUR VERDIKT
-- ============================================
-- Ce script crée une équipe de test complète avec:
-- - 1 équipe (TechScale)
-- - 4 pôles
-- - 8 utilisateurs (1 owner, 2 admins, 5 members)
-- - 5 décisions avec votes et arguments
-- ============================================

-- ⚠️ IMPORTANT: Remplace 'VOTRE_EMAIL@example.com' par ton vrai email Supabase Auth
-- Tu devras d'abord créer cet utilisateur dans Supabase Auth:
-- Dashboard → Authentication → Users → Add user

BEGIN;

-- ============================================
-- 1. CRÉER L'ÉQUIPE
-- ============================================
INSERT INTO teams (id, name, logo, created_at)
VALUES (
    'team-test-001',
    'TechScale',
    NULL,
    NOW()
)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 2. CRÉER LES PÔLES
-- ============================================
INSERT INTO poles (id, team_id, name, description, color, created_at)
VALUES
    ('pole-001', 'team-test-001', 'Marketing & Communication', 'Stratégie marketing, contenu, growth', '#a855f7', NOW()),
    ('pole-002', 'team-test-001', 'Design & Créa', 'UI/UX, branding, design système', '#ec4899', NOW()),
    ('pole-003', 'team-test-001', 'Tech & Produit', 'Développement, infra, produit', '#3b82f6', NOW()),
    ('pole-004', 'team-test-001', 'Ops & Finance', 'Operations, finance, RH', '#10b981', NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 3. CRÉER LES UTILISATEURS
-- ============================================
-- ⚠️ AVANT D'EXÉCUTER, crée d'abord ces users dans Supabase Auth:
-- martin@verdikt.ai (TON EMAIL ICI)
-- alice@verdikt.ai
-- bob@verdikt.ai
-- claire@verdikt.ai
-- david@verdikt.ai
-- emma@verdikt.ai
-- frank@verdikt.ai
-- grace@verdikt.ai

-- Owner (TOI)
INSERT INTO users (id, email, first_name, last_name, team_id, role, pole_id, avatar_color, created_at)
VALUES (
    (SELECT id FROM auth.users WHERE email = 'VOTRE_EMAIL@example.com'),
    'VOTRE_EMAIL@example.com',
    'Martin',
    'Chevalier',
    'team-test-001',
    'owner',
    'pole-003',
    '#3b82f6',
    NOW()
)
ON CONFLICT (id) DO UPDATE SET
    team_id = EXCLUDED.team_id,
    role = EXCLUDED.role,
    pole_id = EXCLUDED.pole_id,
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name;

-- Admin 1
INSERT INTO users (id, email, first_name, last_name, team_id, role, pole_id, avatar_color, created_at)
VALUES (
    gen_random_uuid(),
    'alice@verdikt.ai',
    'Alice',
    'Martin',
    'team-test-001',
    'admin',
    'pole-001',
    '#a855f7',
    NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Admin 2
INSERT INTO users (id, email, first_name, last_name, team_id, role, pole_id, avatar_color, created_at)
VALUES (
    gen_random_uuid(),
    'bob@verdikt.ai',
    'Bob',
    'Dupont',
    'team-test-001',
    'admin',
    'pole-002',
    '#ec4899',
    NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Member 1
INSERT INTO users (id, email, first_name, last_name, team_id, role, pole_id, avatar_color, created_at)
VALUES (
    gen_random_uuid(),
    'claire@verdikt.ai',
    'Claire',
    'Bernard',
    'team-test-001',
    'member',
    'pole-001',
    '#f97316',
    NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Member 2
INSERT INTO users (id, email, first_name, last_name, team_id, role, pole_id, avatar_color, created_at)
VALUES (
    gen_random_uuid(),
    'david@verdikt.ai',
    'David',
    'Rousseau',
    'team-test-001',
    'member',
    'pole-003',
    '#06b6d4',
    NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Member 3
INSERT INTO users (id, email, first_name, last_name, team_id, role, pole_id, avatar_color, created_at)
VALUES (
    gen_random_uuid(),
    'emma@verdikt.ai',
    'Emma',
    'Petit',
    'team-test-001',
    'member',
    'pole-002',
    '#eab308',
    NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Member 4
INSERT INTO users (id, email, first_name, last_name, team_id, role, pole_id, avatar_color, created_at)
VALUES (
    gen_random_uuid(),
    'frank@verdikt.ai',
    'Frank',
    'Moreau',
    'team-test-001',
    'member',
    'pole-004',
    '#10b981',
    NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Member 5
INSERT INTO users (id, email, first_name, last_name, team_id, role, pole_id, avatar_color, created_at)
VALUES (
    gen_random_uuid(),
    'grace@verdikt.ai',
    'Grace',
    'Simon',
    'team-test-001',
    'member',
    'pole-004',
    '#ef4444',
    NOW()
)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 4. CRÉER DES DÉCISIONS
-- ============================================

-- Décision 1: Augmentation des prix (Active)
INSERT INTO decisions (id, team_id, pole_id, creator_id, title, context, deadline, status, created_at)
VALUES (
    'decision-001',
    'team-test-001',
    'pole-004',
    (SELECT id FROM users WHERE email = 'VOTRE_EMAIL@example.com'),
    'Augmentation tarifaire Q2 2026',
    'Suite à l''inflation et l''augmentation de nos coûts (serveurs +15%, salaires +8%), nous devons revoir notre grille tarifaire. L''objectif est de maintenir nos marges tout en restant compétitifs.',
    NOW() + INTERVAL '48 hours',
    'active',
    NOW() - INTERVAL '2 hours'
)
ON CONFLICT (id) DO NOTHING;

-- Options pour décision 1
INSERT INTO vote_options (id, decision_id, label, description, created_at)
VALUES
    ('opt-001-1', 'decision-001', '+10%', 'Augmentation modérée, risque de churn limité', NOW()),
    ('opt-001-2', 'decision-001', '+15%', 'Équilibre entre marge et compétitivité', NOW()),
    ('opt-001-3', 'decision-001', '+20%', 'Maximise la marge mais risque de perte de clients', NOW()),
    ('opt-001-4', 'decision-001', 'Pas d''augmentation', 'On optimise les coûts internes', NOW())
ON CONFLICT (id) DO NOTHING;

-- Participants pour décision 1 (toute l'équipe)
INSERT INTO decision_participants (decision_id, user_id)
SELECT 'decision-001', id FROM users WHERE team_id = 'team-test-001'
ON CONFLICT DO NOTHING;

-- Votes pour décision 1
INSERT INTO votes (decision_id, option_id, user_id, created_at)
SELECT 
    'decision-001',
    'opt-001-2',
    id,
    NOW() - INTERVAL '1 hour'
FROM users 
WHERE email IN ('alice@verdikt.ai', 'bob@verdikt.ai', 'david@verdikt.ai')
ON CONFLICT DO NOTHING;

INSERT INTO votes (decision_id, option_id, user_id, created_at)
SELECT 
    'decision-001',
    'opt-001-1',
    id,
    NOW() - INTERVAL '30 minutes'
FROM users 
WHERE email IN ('claire@verdikt.ai', 'emma@verdikt.ai')
ON CONFLICT DO NOTHING;

-- Arguments pour décision 1
INSERT INTO arguments (decision_id, option_id, user_id, text, created_at)
VALUES
    ('decision-001', 'opt-001-2', (SELECT id FROM users WHERE email = 'alice@verdikt.ai'), 
     '+15% c''est le sweet spot. Nos concurrents ont augmenté de 12-18%, on reste dans la moyenne du marché.', 
     NOW() - INTERVAL '50 minutes'),
    ('decision-001', 'opt-001-1', (SELECT id FROM users WHERE email = 'claire@verdikt.ai'), 
     'Je préfère +10% pour limiter le churn. On a déjà perdu 3 clients le mois dernier à cause du pricing.', 
     NOW() - INTERVAL '40 minutes')
ON CONFLICT DO NOTHING;

-- Décision 2: Refonte du design system (Active)
INSERT INTO decisions (id, team_id, pole_id, creator_id, title, context, deadline, status, created_at)
VALUES (
    'decision-002',
    'team-test-001',
    'pole-002',
    (SELECT id FROM users WHERE email = 'bob@verdikt.ai'),
    'Refonte du Design System',
    'Notre design system actuel date de 2024 et n''est plus adapté à nos besoins. On a des incohérences entre produits, le dark mode est hacky, et l''accessibilité n''est pas au niveau WCAG AA.',
    NOW() + INTERVAL '72 hours',
    'active',
    NOW() - INTERVAL '5 hours'
)
ON CONFLICT (id) DO NOTHING;

-- Options pour décision 2
INSERT INTO vote_options (id, decision_id, label, description, created_at)
VALUES
    ('opt-002-1', 'decision-002', 'Refonte complète', 'On repart de zéro avec Tailwind + Radix', NOW()),
    ('opt-002-2', 'decision-002', 'Évolution progressive', 'On améliore l''existant étape par étape', NOW()),
    ('opt-002-3', 'decision-002', 'Adoption d''un framework', 'On migre vers Chakra UI ou MUI', NOW())
ON CONFLICT (id) DO NOTHING;

-- Participants pour décision 2
INSERT INTO decision_participants (decision_id, user_id)
SELECT 'decision-002', id FROM users 
WHERE team_id = 'team-test-001' 
AND pole_id IN ('pole-002', 'pole-003')
ON CONFLICT DO NOTHING;

-- Décision 3: Stack backend (Completed)
INSERT INTO decisions (id, team_id, pole_id, creator_id, title, context, deadline, status, completed_at, created_at)
VALUES (
    'decision-003',
    'team-test-001',
    'pole-003',
    (SELECT id FROM users WHERE email = 'VOTRE_EMAIL@example.com'),
    'Choix du stack backend',
    'On doit choisir notre stack technique pour le backend. Critères: scalabilité, DX, écosystème, coût.',
    NOW() - INTERVAL '2 days',
    'completed',
    NOW() - INTERVAL '1 day',
    NOW() - INTERVAL '7 days'
)
ON CONFLICT (id) DO NOTHING;

-- Options pour décision 3
INSERT INTO vote_options (id, decision_id, label, description, created_at)
VALUES
    ('opt-003-1', 'decision-003', 'Node.js + Express', 'Classic, simple, flexible', NOW()),
    ('opt-003-2', 'decision-003', 'Next.js API Routes', 'Frontend + backend unifié', NOW()),
    ('opt-003-3', 'decision-003', 'Supabase', 'BaaS, PostgreSQL, Auth inclus', NOW()),
    ('opt-003-4', 'decision-003', 'Go + Gin', 'Performance maximale', NOW())
ON CONFLICT (id) DO NOTHING;

-- Participants pour décision 3
INSERT INTO decision_participants (decision_id, user_id)
SELECT 'decision-003', id FROM users WHERE team_id = 'team-test-001'
ON CONFLICT DO NOTHING;

-- Votes pour décision 3 (Supabase gagne)
INSERT INTO votes (decision_id, option_id, user_id, created_at)
SELECT 
    'decision-003',
    'opt-003-3',
    id,
    NOW() - INTERVAL '2 days'
FROM users 
WHERE email IN ('VOTRE_EMAIL@example.com', 'alice@verdikt.ai', 'bob@verdikt.ai', 'david@verdikt.ai', 'emma@verdikt.ai')
ON CONFLICT DO NOTHING;

INSERT INTO votes (decision_id, option_id, user_id, created_at)
SELECT 
    'decision-003',
    'opt-003-2',
    id,
    NOW() - INTERVAL '2 days'
FROM users 
WHERE email IN ('claire@verdikt.ai', 'frank@verdikt.ai')
ON CONFLICT DO NOTHING;

-- Décision 4: Remote work policy (Active)
INSERT INTO decisions (id, team_id, pole_id, creator_id, title, context, deadline, status, created_at)
VALUES (
    'decision-004',
    'team-test-001',
    'pole-004',
    (SELECT id FROM users WHERE email = 'frank@verdikt.ai'),
    'Politique de télétravail 2026',
    'On doit définir notre politique remote pour l''année. Actuellement c''est flou: certains sont 100% remote, d''autres viennent tous les jours.',
    NOW() + INTERVAL '24 hours',
    'active',
    NOW() - INTERVAL '8 hours'
)
ON CONFLICT (id) DO NOTHING;

-- Options pour décision 4
INSERT INTO vote_options (id, decision_id, label, description, created_at)
VALUES
    ('opt-004-1', 'decision-004', 'Full remote', 'Chacun fait comme il veut', NOW()),
    ('opt-004-2', 'decision-004', 'Hybride 2+2', '2 jours au bureau, 2 jours remote', NOW()),
    ('opt-004-3', 'decision-004', 'Hybride 3+2', '3 jours au bureau, 2 jours remote', NOW()),
    ('opt-004-4', 'decision-004', 'Bureau obligatoire', 'Tout le monde au bureau', NOW())
ON CONFLICT (id) DO NOTHING;

-- Participants pour décision 4
INSERT INTO decision_participants (decision_id, user_id)
SELECT 'decision-004', id FROM users WHERE team_id = 'team-test-001'
ON CONFLICT DO NOTHING;

-- Votes pour décision 4
INSERT INTO votes (decision_id, option_id, user_id, created_at)
SELECT 
    'decision-004',
    'opt-004-2',
    id,
    NOW() - INTERVAL '3 hours'
FROM users 
WHERE email IN ('VOTRE_EMAIL@example.com', 'alice@verdikt.ai', 'grace@verdikt.ai')
ON CONFLICT DO NOTHING;

INSERT INTO votes (decision_id, option_id, user_id, created_at)
SELECT 
    'decision-004',
    'opt-004-1',
    id,
    NOW() - INTERVAL '4 hours'
FROM users 
WHERE email IN ('bob@verdikt.ai', 'emma@verdikt.ai')
ON CONFLICT DO NOTHING;

-- Arguments pour décision 4
INSERT INTO arguments (decision_id, option_id, user_id, text, created_at)
VALUES
    ('decision-004', 'opt-004-2', (SELECT id FROM users WHERE email = 'alice@verdikt.ai'), 
     '2+2 c''est le meilleur compromis. On garde du lien d''équipe sans perdre en flexibilité. Les meilleurs startups font ça.', 
     NOW() - INTERVAL '2 hours'),
    ('decision-004', 'opt-004-1', (SELECT id FROM users WHERE email = 'bob@verdikt.ai'), 
     'Full remote = meilleure attraction de talents. On peut recruter partout en France. Et les études montrent que la productivité augmente.', 
     NOW() - INTERVAL '1 hour')
ON CONFLICT DO NOTHING;

-- Décision 5: Budget marketing Q2 (Active, Urgent)
INSERT INTO decisions (id, team_id, pole_id, creator_id, title, context, deadline, status, created_at)
VALUES (
    'decision-005',
    'team-test-001',
    'pole-001',
    (SELECT id FROM users WHERE email = 'alice@verdikt.ai'),
    'Budget marketing Q2 2026',
    'On doit décider du budget marketing pour Q2. Q1 on a dépensé 15k€ pour 50 leads (300€/lead). Objectif Q2: 100 leads qualifiés.',
    NOW() + INTERVAL '6 hours',
    'active',
    NOW() - INTERVAL '1 hour'
)
ON CONFLICT (id) DO NOTHING;

-- Options pour décision 5
INSERT INTO vote_options (id, decision_id, label, description, created_at)
VALUES
    ('opt-005-1', 'decision-005', '20k€', 'On double le budget pour atteindre l''objectif', NOW()),
    ('opt-005-2', 'decision-005', '25k€', 'On investit plus pour accélérer', NOW()),
    ('opt-005-3', 'decision-005', '15k€', 'On garde le même budget et on optimise', NOW())
ON CONFLICT (id) DO NOTHING;

-- Participants pour décision 5
INSERT INTO decision_participants (decision_id, user_id)
SELECT 'decision-005', id FROM users 
WHERE team_id = 'team-test-001' 
AND pole_id IN ('pole-001', 'pole-004')
ON CONFLICT DO NOTHING;

-- ============================================
-- 5. VÉRIFICATIONS
-- ============================================
-- Affiche un résumé des données créées
SELECT 
    'Équipe créée' as status, 
    name 
FROM teams 
WHERE id = 'team-test-001';

SELECT 
    'Pôles créés' as status, 
    COUNT(*) as count 
FROM poles 
WHERE team_id = 'team-test-001';

SELECT 
    'Utilisateurs créés' as status, 
    COUNT(*) as count 
FROM users 
WHERE team_id = 'team-test-001';

SELECT 
    'Décisions créées' as status, 
    COUNT(*) as count,
    COUNT(*) FILTER (WHERE status = 'active') as active,
    COUNT(*) FILTER (WHERE status = 'completed') as completed
FROM decisions 
WHERE team_id = 'team-test-001';

SELECT 
    'Votes créés' as status, 
    COUNT(*) as count 
FROM votes v
JOIN decisions d ON d.id = v.decision_id
WHERE d.team_id = 'team-test-001';

SELECT 
    'Arguments créés' as status, 
    COUNT(*) as count 
FROM arguments a
JOIN decisions d ON d.id = a.decision_id
WHERE d.team_id = 'team-test-001';

COMMIT;

-- ============================================
-- 🎉 SETUP TERMINÉ !
-- ============================================
-- Maintenant:
-- 1. Crée ton user dans Supabase Auth avec ton email
-- 2. Lance ce script
-- 3. Connecte-toi à l'app
-- 4. Teste toutes les fonctionnalités !
-- ============================================
