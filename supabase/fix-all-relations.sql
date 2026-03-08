-- ============================================
-- FIX COMPLET : Relations entre décisions, participants, options
-- ============================================

BEGIN;

-- 1. Corriger le team_id des décisions (comme précédemment)
UPDATE decisions d
SET team_id = u.team_id
FROM users u
WHERE d.creator_id = u.id
  AND (d.team_id IS NULL OR d.team_id != u.team_id);

-- 2. Pour chaque décision, vérifier qu'il y a des vote_options
-- Si pas d'options, créer 2 options par défaut
INSERT INTO vote_options (decision_id, label, position)
SELECT 
    d.id,
    'Option ' || (ROW_NUMBER() OVER (PARTITION BY d.id ORDER BY d.id))::text,
    (ROW_NUMBER() OVER (PARTITION BY d.id ORDER BY d.id) - 1)::int
FROM decisions d
LEFT JOIN vote_options vo ON vo.decision_id = d.id
WHERE vo.id IS NULL
LIMIT 2;

-- 3. Pour chaque décision, ajouter le créateur comme participant (s'il n'y est pas déjà)
INSERT INTO decision_participants (decision_id, user_id)
SELECT 
    d.id,
    d.creator_id
FROM decisions d
WHERE NOT EXISTS (
    SELECT 1 
    FROM decision_participants dp 
    WHERE dp.decision_id = d.id 
    AND dp.user_id = d.creator_id
);

-- 4. Résumé
SELECT 
    '=== DÉCISIONS ===' as section,
    COUNT(*) as count
FROM decisions

UNION ALL

SELECT 
    '=== OPTIONS ===' as section,
    COUNT(*) as count
FROM vote_options

UNION ALL

SELECT 
    '=== PARTICIPANTS ===' as section,
    COUNT(*) as count
FROM decision_participants

UNION ALL

SELECT 
    '=== VOTES ===' as section,
    COUNT(*) as count
FROM votes;

-- 5. Détail par décision
SELECT 
    d.id,
    d.title,
    d.status,
    t.name as team_name,
    u.first_name || ' ' || u.last_name as creator,
    (SELECT COUNT(*) FROM vote_options WHERE decision_id = d.id) as options_count,
    (SELECT COUNT(*) FROM decision_participants WHERE decision_id = d.id) as participants_count,
    (SELECT COUNT(*) FROM votes WHERE decision_id = d.id) as votes_count
FROM decisions d
LEFT JOIN teams t ON d.team_id = t.id
LEFT JOIN users u ON d.creator_id = u.id
ORDER BY d.created_at DESC;

COMMIT;

SELECT '✅ Toutes les relations sont corrigées !' as result;
