-- ============================================
-- MIGRATION : Table team_integrations
-- ============================================
-- Stocke les tokens et config des integrations
-- externes (Slack, Notion, Google Calendar)
-- ============================================

BEGIN;

CREATE TABLE IF NOT EXISTS team_integrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    provider TEXT NOT NULL,
    access_token TEXT NOT NULL,
    bot_user_id TEXT,
    channel_id TEXT,
    channel_name TEXT,
    workspace_name TEXT,
    webhook_url TEXT,
    settings JSONB DEFAULT '{}',
    connected_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(team_id, provider)
);

-- Trigger updated_at
CREATE OR REPLACE FUNCTION update_team_integrations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_team_integrations_updated_at ON team_integrations;
CREATE TRIGGER set_team_integrations_updated_at
    BEFORE UPDATE ON team_integrations
    FOR EACH ROW
    EXECUTE FUNCTION update_team_integrations_updated_at();

COMMIT;

SELECT 'team_integrations table created' as status;
