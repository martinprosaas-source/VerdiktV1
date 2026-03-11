-- ============================================================
-- RLS Policies - Permissions par rôle
-- À exécuter dans Supabase > SQL Editor
-- ============================================================

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
-- (Remplace la politique trop permissive existante si elle existe)
-- -------------------------------------------------------
-- DROP POLICY IF EXISTS "audit_logs_select_all" ON audit_logs;

CREATE POLICY "audit_logs_select_by_role"
ON audit_logs FOR SELECT
USING (
    team_id IN (SELECT team_id FROM users WHERE id = auth.uid())
    AND (SELECT role FROM users WHERE id = auth.uid()) IN ('owner', 'admin')
);
