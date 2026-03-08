-- ============================================
-- TEST DATA : AUDIT LOGS
-- ============================================
-- Génère des entrées d'audit log pour tester
-- ============================================

-- Récupère l'ID de ton user et de ta team
DO $$
DECLARE
    v_user_id UUID;
    v_team_id UUID;
    v_decision_id UUID;
BEGIN
    -- Ton user
    SELECT id, team_id INTO v_user_id, v_team_id
    FROM users
    WHERE email = 'martin@example.com' -- Remplace par ton email
    LIMIT 1;

    -- Prend une décision existante (si elle existe)
    SELECT id INTO v_decision_id
    FROM decisions
    WHERE team_id = v_team_id
    LIMIT 1;

    -- Insère quelques logs d'exemple
    INSERT INTO audit_logs (user_id, decision_id, action, details, created_at) VALUES
    (v_user_id, v_decision_id, 'decision_created', 'A créé la décision "Passer en full remote ou garder le bureau ?"', NOW() - INTERVAL '2 hours'),
    (v_user_id, NULL, 'member_invited', 'A invité Emma à rejoindre l''équipe', NOW() - INTERVAL '5 hours'),
    (v_user_id, v_decision_id, 'vote_cast', 'A voté "Oui" sur la décision "Augmentation tarifaire"', NOW() - INTERVAL '1 day'),
    (v_user_id, v_decision_id, 'argument_added', 'A ajouté un argument en faveur de l''augmentation tarifaire', NOW() - INTERVAL '1 day'),
    (v_user_id, NULL, 'settings_changed', 'A modifié les paramètres de l''équipe', NOW() - INTERVAL '2 days'),
    (v_user_id, v_decision_id, 'vote_changed', 'A modifié son vote sur "Choix du nouveau CRM"', NOW() - INTERVAL '3 days'),
    (v_user_id, v_decision_id, 'deadline_changed', 'A repoussé la deadline de "Recrutement DA senior"', NOW() - INTERVAL '4 days'),
    (v_user_id, NULL, 'member_role_changed', 'A promu Emma au rôle d''admin', NOW() - INTERVAL '5 days');

    RAISE NOTICE 'Audit logs créés avec succès pour user_id: %', v_user_id;
END $$;

SELECT '✅ Audit logs de test créés !' as status;
