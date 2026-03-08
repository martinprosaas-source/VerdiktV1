-- ============================================
-- DEBUG : Vérifier les données
-- ============================================
-- Pour comprendre pourquoi les décisions ne s'affichent pas
-- ============================================

-- 1. Afficher l'utilisateur Martin et son team_id
SELECT 
    id as user_id,
    email,
    first_name,
    last_name,
    team_id,
    role
FROM users
WHERE email LIKE '%martin%' OR first_name = 'Martin'
LIMIT 5;

-- 2. Afficher toutes les teams
SELECT 
    id as team_id,
    name as team_name,
    slug,
    created_at
FROM teams
ORDER BY created_at DESC;

-- 3. Afficher toutes les décisions avec leur team_id
SELECT 
    id as decision_id,
    title,
    team_id,
    creator_id,
    status,
    created_at
FROM decisions
ORDER BY created_at DESC;

-- 4. Vérifier si les team_id correspondent
SELECT 
    'USER' as type,
    u.email,
    u.team_id,
    t.name as team_name
FROM users u
LEFT JOIN teams t ON u.team_id = t.id
WHERE u.email LIKE '%martin%' OR u.first_name = 'Martin'

UNION ALL

SELECT 
    'DECISION' as type,
    d.title as email,
    d.team_id,
    t.name as team_name
FROM decisions d
LEFT JOIN teams t ON d.team_id = t.id
ORDER BY type, team_id;
