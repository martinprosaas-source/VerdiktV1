-- ============================================
-- TRIGGER AUTOMATIQUE : auth.users → public.users
-- ============================================
-- Quand un user est créé dans auth.users,
-- on crée automatiquement son profil dans public.users
-- ============================================

BEGIN;

-- 1. Créer la fonction trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, created_at)
    VALUES (NEW.id, NEW.email, NOW())
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Drop le trigger s'il existe déjà
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 3. Créer le trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

COMMIT;

-- ============================================
-- VÉRIFICATION
-- ============================================
SELECT '✅ Trigger créé ! Les nouveaux users auth seront automatiquement ajoutés à public.users' as status;
