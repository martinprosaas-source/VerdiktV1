-- ============================================
-- FIX RLS - VERSION SIMPLIFIÉE
-- ============================================
-- Ce script drop TOUTES les policies et les recrée proprement
-- ============================================

BEGIN;

-- 1. DROP TOUTES LES POLICIES EXISTANTES (sans erreur si elles n'existent pas)
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT schemaname, tablename, policyname 
              FROM pg_policies 
              WHERE schemaname = 'public') 
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON ' || quote_ident(r.schemaname) || '.' || quote_ident(r.tablename);
    END LOOP;
END $$;

-- 2. Drop l'ancienne fonction si elle existe
DROP FUNCTION IF EXISTS public.get_user_team_id();

-- 3. Créer la fonction helper
CREATE FUNCTION public.get_user_team_id()
RETURNS uuid
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT team_id FROM public.users WHERE id = auth.uid() LIMIT 1;
$$;

-- 4. Créer les policies (version SIMPLE - juste ce qui est nécessaire pour l'onboarding et l'usage de base)

-- TEAMS
CREATE POLICY "teams_select" ON teams FOR SELECT USING (id = public.get_user_team_id());
CREATE POLICY "teams_insert" ON teams FOR INSERT WITH CHECK (true); -- Allow onboarding
CREATE POLICY "teams_update" ON teams FOR UPDATE USING (id = public.get_user_team_id());

-- USERS
CREATE POLICY "users_select" ON users FOR SELECT USING (team_id = public.get_user_team_id() OR id = auth.uid());
CREATE POLICY "users_insert" ON users FOR INSERT WITH CHECK (id = auth.uid());
CREATE POLICY "users_update" ON users FOR UPDATE USING (id = auth.uid() OR team_id = public.get_user_team_id());

-- POLES
CREATE POLICY "poles_select" ON poles FOR SELECT USING (team_id = public.get_user_team_id());
CREATE POLICY "poles_insert" ON poles FOR INSERT WITH CHECK (team_id = public.get_user_team_id() OR team_id IN (SELECT id FROM teams WHERE id = public.get_user_team_id()));
CREATE POLICY "poles_update" ON poles FOR UPDATE USING (team_id = public.get_user_team_id());
CREATE POLICY "poles_delete" ON poles FOR DELETE USING (team_id = public.get_user_team_id());

-- DECISIONS
CREATE POLICY "decisions_select" ON decisions FOR SELECT USING (team_id = public.get_user_team_id());
CREATE POLICY "decisions_insert" ON decisions FOR INSERT WITH CHECK (team_id = public.get_user_team_id() AND creator_id = auth.uid());
CREATE POLICY "decisions_update" ON decisions FOR UPDATE USING (team_id = public.get_user_team_id());

-- VOTE OPTIONS
CREATE POLICY "vote_options_select" ON vote_options FOR SELECT USING (decision_id IN (SELECT id FROM decisions WHERE team_id = public.get_user_team_id()));
CREATE POLICY "vote_options_insert" ON vote_options FOR INSERT WITH CHECK (decision_id IN (SELECT id FROM decisions WHERE creator_id = auth.uid()));

-- VOTES
CREATE POLICY "votes_select" ON votes FOR SELECT USING (decision_id IN (SELECT id FROM decisions WHERE team_id = public.get_user_team_id()));
CREATE POLICY "votes_insert" ON votes FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "votes_update" ON votes FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "votes_delete" ON votes FOR DELETE USING (user_id = auth.uid());

-- ARGUMENTS
CREATE POLICY "arguments_select" ON arguments FOR SELECT USING (decision_id IN (SELECT id FROM decisions WHERE team_id = public.get_user_team_id()));
CREATE POLICY "arguments_insert" ON arguments FOR INSERT WITH CHECK (user_id = auth.uid());

-- DECISION PARTICIPANTS
CREATE POLICY "decision_participants_select" ON decision_participants FOR SELECT USING (decision_id IN (SELECT id FROM decisions WHERE team_id = public.get_user_team_id()));
CREATE POLICY "decision_participants_insert" ON decision_participants FOR INSERT WITH CHECK (decision_id IN (SELECT id FROM decisions WHERE creator_id = auth.uid()));

-- AI SUMMARIES
CREATE POLICY "ai_summaries_select" ON ai_summaries FOR SELECT USING (decision_id IN (SELECT id FROM decisions WHERE team_id = public.get_user_team_id()));

-- NOTIFICATIONS
CREATE POLICY "notifications_select" ON notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "notifications_update" ON notifications FOR UPDATE USING (user_id = auth.uid());

-- AUDIT LOGS
CREATE POLICY "audit_logs_select" ON audit_logs FOR SELECT USING (team_id = public.get_user_team_id());

-- PENDING INVITES
CREATE POLICY "pending_invites_select" ON pending_invites FOR SELECT USING (team_id = public.get_user_team_id());
CREATE POLICY "pending_invites_insert" ON pending_invites FOR INSERT WITH CHECK (team_id = public.get_user_team_id());

COMMIT;

-- ============================================
-- VERIFICATION
-- ============================================
SELECT 'RLS policies fixed successfully!' as status;

-- Compte le nombre de policies créées
SELECT 
    tablename,
    COUNT(*) as policy_count
FROM pg_policies
WHERE schemaname = 'public'
GROUP BY tablename
ORDER BY tablename;
