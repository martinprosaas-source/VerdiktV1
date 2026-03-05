-- ============================================
-- DÉSACTIVER RLS TEMPORAIREMENT
-- ============================================
-- Pour pouvoir tester l'app MAINTENANT
-- On réactivera et fixera RLS plus tard
-- ============================================

-- Désactiver RLS sur TOUTES les tables
ALTER TABLE teams DISABLE ROW LEVEL SECURITY;
ALTER TABLE poles DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE decisions DISABLE ROW LEVEL SECURITY;
ALTER TABLE vote_options DISABLE ROW LEVEL SECURITY;
ALTER TABLE votes DISABLE ROW LEVEL SECURITY;
ALTER TABLE arguments DISABLE ROW LEVEL SECURITY;
ALTER TABLE decision_participants DISABLE ROW LEVEL SECURITY;
ALTER TABLE ai_summaries DISABLE ROW LEVEL SECURITY;
ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE pending_invites DISABLE ROW LEVEL SECURITY;

SELECT '✅ RLS DÉSACTIVÉ - Tu peux tester l''app maintenant !' as status;
