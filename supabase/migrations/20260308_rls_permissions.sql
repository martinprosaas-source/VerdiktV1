-- ============================================================
-- RLS Policies - Permissions par rôle
-- À exécuter dans Supabase > SQL Editor
-- Idempotent : supprime les policies si elles existent déjà
-- ============================================================

DROP POLICY IF EXISTS "decisions_update_by_role" ON decisions;
DROP POLICY IF EXISTS "decisions_delete_by_role" ON decisions;
DROP POLICY IF EXISTS "poles_insert_by_role" ON poles;
DROP POLICY IF EXISTS "poles_update_by_role" ON poles;
DROP POLICY IF EXISTS "poles_delete_by_role" ON poles;
DROP POLICY IF EXISTS "users_update_by_admin" ON users;
DROP POLICY IF EXISTS "arguments_update_own" ON arguments;
DROP POLICY IF EXISTS "arguments_delete_by_role" ON arguments;
DROP POLICY IF EXISTS "votes_delete_own" ON votes;
DROP POLICY IF EXISTS "audit_logs_select_by_role" ON audit_logs;

-- -------------------------------------------------------
-- DECISIONS : UPDATE (owner/admin de l'équipe OU créateur)
-- -------------------------------------------------------
CREATE POLICY "decisions_update_by_role"
ON decisions FOR UPDATE
USING (
    team_id IN (SELECT team_id FROM users WHERE id = auth.uid())
    AND (
        (SELECT role FROM users WHERE id = auth.uid()) IN ('owner', 'admin')
        OR creator_id = auth.uid()
    )
);

-- -------------------------------------------------------
-- DECISIONS : DELETE (owner/admin uniquement)
-- -------------------------------------------------------
CREATE POLICY "decisions_delete_by_role"
ON decisions FOR DELETE
USING (
    team_id IN (SELECT team_id FROM users WHERE id = auth.uid())
    AND (SELECT role FROM users WHERE id = auth.uid()) IN ('owner', 'admin')
);

-- -------------------------------------------------------
-- POLES : INSERT (owner/admin uniquement)
-- -------------------------------------------------------
CREATE POLICY "poles_insert_by_role"
ON poles FOR INSERT
WITH CHECK (
    (SELECT role FROM users WHERE id = auth.uid()) IN ('owner', 'admin')
    AND team_id IN (SELECT team_id FROM users WHERE id = auth.uid())
);

-- -------------------------------------------------------
-- POLES : UPDATE (owner/admin uniquement)
-- -------------------------------------------------------
CREATE POLICY "poles_update_by_role"
ON poles FOR UPDATE
USING (
    team_id IN (SELECT team_id FROM users WHERE id = auth.uid())
    AND (SELECT role FROM users WHERE id = auth.uid()) IN ('owner', 'admin')
);

-- -------------------------------------------------------
-- POLES : DELETE (owner/admin uniquement)
-- -------------------------------------------------------
CREATE POLICY "poles_delete_by_role"
ON poles FOR DELETE
USING (
    team_id IN (SELECT team_id FROM users WHERE id = auth.uid())
    AND (SELECT role FROM users WHERE id = auth.uid()) IN ('owner', 'admin')
);

-- -------------------------------------------------------
-- USERS : UPDATE par admin (pour assigner pôles, changer rôles)
-- -------------------------------------------------------
CREATE POLICY "users_update_by_admin"
ON users FOR UPDATE
USING (
    -- L'utilisateur met à jour son propre profil, OU
    id = auth.uid()
    OR (
        -- Un owner/admin de la même équipe peut mettre à jour les membres
        team_id IN (SELECT team_id FROM users WHERE id = auth.uid())
        AND (SELECT role FROM users WHERE id = auth.uid()) IN ('owner', 'admin')
    )
);

-- -------------------------------------------------------
-- ARGUMENTS : UPDATE (auteur uniquement)
-- -------------------------------------------------------
CREATE POLICY "arguments_update_own"
ON arguments FOR UPDATE
USING (user_id = auth.uid());

-- -------------------------------------------------------
-- ARGUMENTS : DELETE (auteur, ou owner/admin)
-- -------------------------------------------------------
CREATE POLICY "arguments_delete_by_role"
ON arguments FOR DELETE
USING (
    user_id = auth.uid()
    OR (SELECT role FROM users WHERE id = auth.uid()) IN ('owner', 'admin')
);

-- -------------------------------------------------------
-- VOTES : DELETE (auteur uniquement — pour changer son vote)
-- -------------------------------------------------------
CREATE POLICY "votes_delete_own"
ON votes FOR DELETE
USING (user_id = auth.uid());

-- -------------------------------------------------------
-- AUDIT LOGS : SELECT restreint aux owner/admin
-- (audit_logs n'a pas de team_id, on passe par decisions)
-- -------------------------------------------------------
DROP POLICY IF EXISTS "Users can view team audit logs" ON audit_logs;

CREATE POLICY "audit_logs_select_by_role"
ON audit_logs FOR SELECT
USING (
    (SELECT role FROM users WHERE id = auth.uid()) IN ('owner', 'admin')
    AND (
        decision_id IN (
            SELECT id FROM decisions WHERE team_id IN (
                SELECT team_id FROM users WHERE id = auth.uid()
            )
        )
        OR user_id = auth.uid()
    )
);
