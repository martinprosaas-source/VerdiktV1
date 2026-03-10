-- Table to track pending member invitations
CREATE TABLE IF NOT EXISTS invitations (
    id          uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
    team_id     uuid        NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    email       text        NOT NULL,
    role        text        NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member')),
    invited_by  uuid        REFERENCES users(id) ON DELETE SET NULL,
    status      text        NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired')),
    created_at  timestamptz DEFAULT now(),
    expires_at  timestamptz DEFAULT now() + interval '24 hours',
    UNIQUE (team_id, email)
);

ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;

-- Team members can view invitations for their team
CREATE POLICY "invitations_select" ON invitations
    FOR SELECT TO authenticated
    USING (
        team_id = (
            SELECT team_id FROM users WHERE id = auth.uid() LIMIT 1
        )
    );

-- Service role can insert/update (called from Edge Functions)
CREATE POLICY "invitations_insert_service" ON invitations
    FOR INSERT TO service_role
    WITH CHECK (true);

CREATE POLICY "invitations_update_service" ON invitations
    FOR UPDATE TO service_role
    USING (true);
