-- ============================================
-- FIX RLS INFINITE RECURSION
-- ============================================
-- Ce script corrige le problème de récursion infinie
-- dans les policies RLS de Supabase
-- ============================================

BEGIN;

-- 1. Drop les policies problématiques
DROP POLICY IF EXISTS "Users can view their own team" ON teams;
DROP POLICY IF EXISTS "Users can view team members" ON users;
DROP POLICY IF EXISTS "Users can view team poles" ON poles;
DROP POLICY IF EXISTS "Users can view team decisions" ON decisions;
DROP POLICY IF EXISTS "Users can view decision options" ON vote_options;
DROP POLICY IF EXISTS "Users can view team votes" ON votes;
DROP POLICY IF EXISTS "Users can view team arguments" ON arguments;
DROP POLICY IF EXISTS "Users can view decision participants" ON decision_participants;
DROP POLICY IF EXISTS "Users can view team notifications" ON notifications;
DROP POLICY IF EXISTS "Users can view team audit logs" ON audit_logs;
DROP POLICY IF EXISTS "Users can view team invites" ON pending_invites;

-- 2. Créer une fonction helper pour éviter la récursion
CREATE OR REPLACE FUNCTION public.get_user_team_id()
RETURNS uuid
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT team_id FROM public.users WHERE id = auth.uid() LIMIT 1;
$$;

-- 3. Recréer les policies SANS récursion

-- TEAMS: Users can only see their own team
CREATE POLICY "Users can view their own team" ON teams
    FOR SELECT USING (
        id = public.get_user_team_id()
    );

CREATE POLICY "Owners and admins can update team" ON teams
    FOR UPDATE USING (
        id = public.get_user_team_id() AND
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('owner', 'admin'))
    );

-- USERS: Users can see users in their team (SANS récursion)
CREATE POLICY "Users can view team members" ON users
    FOR SELECT USING (
        team_id = public.get_user_team_id()
    );

CREATE POLICY "Users can insert themselves during onboarding" ON users
    FOR INSERT WITH CHECK (
        id = auth.uid()
    );

CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (
        id = auth.uid()
    );

CREATE POLICY "Owners and admins can update team members" ON users
    FOR UPDATE USING (
        team_id = public.get_user_team_id() AND
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('owner', 'admin'))
    );

-- POLES: Users can see poles in their team
CREATE POLICY "Users can view team poles" ON poles
    FOR SELECT USING (
        team_id = public.get_user_team_id()
    );

CREATE POLICY "Users can insert poles during onboarding" ON poles
    FOR INSERT WITH CHECK (
        team_id = public.get_user_team_id()
    );

CREATE POLICY "Owners and admins can manage poles" ON poles
    FOR ALL USING (
        team_id = public.get_user_team_id() AND
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('owner', 'admin'))
    );

-- DECISIONS: Users can see decisions in their team
CREATE POLICY "Users can view team decisions" ON decisions
    FOR SELECT USING (
        team_id = public.get_user_team_id()
    );

CREATE POLICY "Users can create decisions" ON decisions
    FOR INSERT WITH CHECK (
        team_id = public.get_user_team_id() AND
        creator_id = auth.uid()
    );

CREATE POLICY "Creators and admins can update decisions" ON decisions
    FOR UPDATE USING (
        team_id = public.get_user_team_id() AND
        (creator_id = auth.uid() OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('owner', 'admin')))
    );

-- VOTE OPTIONS: Users can see options for team decisions
CREATE POLICY "Users can view decision options" ON vote_options
    FOR SELECT USING (
        decision_id IN (SELECT id FROM decisions WHERE team_id = public.get_user_team_id())
    );

CREATE POLICY "Users can create options for their decisions" ON vote_options
    FOR INSERT WITH CHECK (
        decision_id IN (SELECT id FROM decisions WHERE creator_id = auth.uid())
    );

-- VOTES: Users can see team votes
CREATE POLICY "Users can view team votes" ON votes
    FOR SELECT USING (
        decision_id IN (SELECT id FROM decisions WHERE team_id = public.get_user_team_id())
    );

CREATE POLICY "Users can vote on team decisions" ON votes
    FOR INSERT WITH CHECK (
        user_id = auth.uid() AND
        decision_id IN (SELECT id FROM decisions WHERE team_id = public.get_user_team_id())
    );

CREATE POLICY "Users can update their own votes" ON votes
    FOR UPDATE USING (
        user_id = auth.uid()
    );

CREATE POLICY "Users can delete their own votes" ON votes
    FOR DELETE USING (
        user_id = auth.uid()
    );

-- ARGUMENTS: Users can see team arguments
CREATE POLICY "Users can view team arguments" ON arguments
    FOR SELECT USING (
        decision_id IN (SELECT id FROM decisions WHERE team_id = public.get_user_team_id())
    );

CREATE POLICY "Users can add arguments to team decisions" ON arguments
    FOR INSERT WITH CHECK (
        user_id = auth.uid() AND
        decision_id IN (SELECT id FROM decisions WHERE team_id = public.get_user_team_id())
    );

-- DECISION PARTICIPANTS: Users can see participants
CREATE POLICY "Users can view decision participants" ON decision_participants
    FOR SELECT USING (
        decision_id IN (SELECT id FROM decisions WHERE team_id = public.get_user_team_id())
    );

CREATE POLICY "Users can add participants to their decisions" ON decision_participants
    FOR INSERT WITH CHECK (
        decision_id IN (SELECT id FROM decisions WHERE creator_id = auth.uid())
    );

-- AI SUMMARIES: Users can see summaries for team decisions
CREATE POLICY "Users can view team ai summaries" ON ai_summaries
    FOR SELECT USING (
        decision_id IN (SELECT id FROM decisions WHERE team_id = public.get_user_team_id())
    );

-- NOTIFICATIONS: Users can see their own notifications
CREATE POLICY "Users can view their own notifications" ON notifications
    FOR SELECT USING (
        user_id = auth.uid()
    );

CREATE POLICY "Users can update their own notifications" ON notifications
    FOR UPDATE USING (
        user_id = auth.uid()
    );

-- AUDIT LOGS: Owners and admins can see team audit logs
CREATE POLICY "Owners and admins can view team audit logs" ON audit_logs
    FOR SELECT USING (
        team_id = public.get_user_team_id() AND
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('owner', 'admin'))
    );

-- PENDING INVITES: Users can see team invites
CREATE POLICY "Users can view team invites" ON pending_invites
    FOR SELECT USING (
        team_id = public.get_user_team_id()
    );

CREATE POLICY "Owners and admins can manage invites" ON pending_invites
    FOR ALL USING (
        team_id = public.get_user_team_id() AND
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('owner', 'admin'))
    );

COMMIT;

-- ============================================
-- VERIFICATION
-- ============================================
SELECT 'RLS policies fixed successfully!' as status;

-- Liste toutes les policies
SELECT 
    schemaname,
    tablename,
    policyname
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
