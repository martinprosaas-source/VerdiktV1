-- Table pour stocker les tokens Google Calendar par utilisateur
CREATE TABLE IF NOT EXISTS user_google_tokens (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    access_token TEXT NOT NULL,
    refresh_token TEXT,
    token_expires_at TIMESTAMPTZ,
    calendar_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger pour updated_at
CREATE OR REPLACE TRIGGER update_user_google_tokens_updated_at
    BEFORE UPDATE ON user_google_tokens
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- RLS
ALTER TABLE user_google_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_google_tokens_select" ON user_google_tokens
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "user_google_tokens_insert" ON user_google_tokens
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "user_google_tokens_update" ON user_google_tokens
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "user_google_tokens_delete" ON user_google_tokens
    FOR DELETE USING (user_id = auth.uid());

-- Ajouter la colonne google_calendar_event_id à la table decisions
ALTER TABLE decisions ADD COLUMN IF NOT EXISTS google_calendar_event_id TEXT;
