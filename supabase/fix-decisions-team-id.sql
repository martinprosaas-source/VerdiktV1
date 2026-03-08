-- ============================================
-- FIX : Corriger le team_id des décisions
-- ============================================
-- Met à jour toutes les décisions pour qu'elles aient
-- le team_id de leur créateur
-- ============================================

-- Afficher avant correction
SELECT 
    d.id,
    d.title,
    d.team_id as decision_team_id,
    u.team_id as creator_team_id,
    CASE 
        WHEN d.team_id = u.team_id THEN '✅ OK'
        WHEN d.team_id IS NULL THEN '❌ NULL'
        ELSE '❌ MISMATCH'
    END as status
FROM decisions d
LEFT JOIN users u ON d.creator_id = u.id;

-- Corriger : mettre le team_id du créateur
UPDATE decisions d
SET team_id = u.team_id
FROM users u
WHERE d.creator_id = u.id
  AND (d.team_id IS NULL OR d.team_id != u.team_id);

-- Afficher après correction
SELECT 
    d.id,
    d.title,
    d.team_id as decision_team_id,
    u.team_id as creator_team_id,
    u.first_name || ' ' || u.last_name as creator_name,
    CASE 
        WHEN d.team_id = u.team_id THEN '✅ OK'
        ELSE '❌ PROBLEM'
    END as status
FROM decisions d
LEFT JOIN users u ON d.creator_id = u.id;

SELECT '✅ Team IDs des décisions corrigés !' as result;
