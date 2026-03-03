-- ============================================
-- VERDIKT DATABASE SCHEMA
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TEAMS TABLE
-- ============================================
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- POLES TABLE
-- ============================================
CREATE TABLE poles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    color TEXT NOT NULL DEFAULT 'blue',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
    pole_id UUID REFERENCES poles(id) ON DELETE SET NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
    avatar_color TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- DECISIONS TABLE
-- ============================================
CREATE TABLE decisions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    pole_id UUID REFERENCES poles(id) ON DELETE SET NULL,
    creator_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    context TEXT,
    deadline TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived')),
    template_id TEXT,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- VOTE OPTIONS TABLE
-- ============================================
CREATE TABLE vote_options (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    decision_id UUID REFERENCES decisions(id) ON DELETE CASCADE,
    label TEXT NOT NULL,
    position INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- VOTES TABLE
-- ============================================
CREATE TABLE votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    decision_id UUID REFERENCES decisions(id) ON DELETE CASCADE,
    option_id UUID REFERENCES vote_options(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(decision_id, user_id) -- Un user = un vote par décision
);

-- ============================================
-- ARGUMENTS TABLE
-- ============================================
CREATE TABLE arguments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    decision_id UUID REFERENCES decisions(id) ON DELETE CASCADE,
    option_id UUID REFERENCES vote_options(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    mentions UUID[], -- Array of user IDs
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- DECISION PARTICIPANTS TABLE (Many-to-Many)
-- ============================================
CREATE TABLE decision_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    decision_id UUID REFERENCES decisions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(decision_id, user_id)
);

-- ============================================
-- AI SUMMARIES TABLE
-- ============================================
CREATE TABLE ai_summaries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    decision_id UUID UNIQUE REFERENCES decisions(id) ON DELETE CASCADE,
    result TEXT NOT NULL,
    winning_option TEXT NOT NULL,
    main_arguments JSONB NOT NULL,
    concerns TEXT[],
    recommendation TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    decision_id UUID REFERENCES decisions(id) ON DELETE CASCADE,
    triggered_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- AUDIT LOG TABLE
-- ============================================
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    decision_id UUID REFERENCES decisions(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    details TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PENDING INVITES TABLE
-- ============================================
CREATE TABLE pending_invites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member')),
    invited_by_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(team_id, email)
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX idx_users_team_id ON users(team_id);
CREATE INDEX idx_users_pole_id ON users(pole_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_decisions_team_id ON decisions(team_id);
CREATE INDEX idx_decisions_creator_id ON decisions(creator_id);
CREATE INDEX idx_decisions_status ON decisions(status);
CREATE INDEX idx_decisions_deadline ON decisions(deadline);
CREATE INDEX idx_votes_decision_id ON votes(decision_id);
CREATE INDEX idx_votes_user_id ON votes(user_id);
CREATE INDEX idx_arguments_decision_id ON arguments(decision_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_decision_id ON audit_logs(decision_id);

-- ============================================
-- FUNCTIONS FOR AUTOMATIC TIMESTAMPS
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers
CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_poles_updated_at BEFORE UPDATE ON poles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_decisions_updated_at BEFORE UPDATE ON decisions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_arguments_updated_at BEFORE UPDATE ON arguments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE poles ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE vote_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE arguments ENABLE ROW LEVEL SECURITY;
ALTER TABLE decision_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE pending_invites ENABLE ROW LEVEL SECURITY;

-- TEAMS: Users can only see their own team
CREATE POLICY "Users can view their own team" ON teams
    FOR SELECT USING (
        id IN (SELECT team_id FROM users WHERE id = auth.uid())
    );

-- USERS: Users can see users in their team
CREATE POLICY "Users can view team members" ON users
    FOR SELECT USING (
        team_id IN (SELECT team_id FROM users WHERE id = auth.uid())
    );

CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (id = auth.uid());

-- POLES: Users can see poles in their team
CREATE POLICY "Users can view team poles" ON poles
    FOR SELECT USING (
        team_id IN (SELECT team_id FROM users WHERE id = auth.uid())
    );

-- DECISIONS: Users can see decisions in their team
CREATE POLICY "Users can view team decisions" ON decisions
    FOR SELECT USING (
        team_id IN (SELECT team_id FROM users WHERE id = auth.uid())
    );

CREATE POLICY "Users can create decisions in their team" ON decisions
    FOR INSERT WITH CHECK (
        team_id IN (SELECT team_id FROM users WHERE id = auth.uid())
    );

-- VOTE OPTIONS: Users can see options for decisions they can see
CREATE POLICY "Users can view vote options" ON vote_options
    FOR SELECT USING (
        decision_id IN (
            SELECT id FROM decisions WHERE team_id IN (
                SELECT team_id FROM users WHERE id = auth.uid()
            )
        )
    );

-- VOTES: Users can see votes and create their own
CREATE POLICY "Users can view votes" ON votes
    FOR SELECT USING (
        decision_id IN (
            SELECT id FROM decisions WHERE team_id IN (
                SELECT team_id FROM users WHERE id = auth.uid()
            )
        )
    );

CREATE POLICY "Users can create their own votes" ON votes
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- ARGUMENTS: Users can view and create arguments
CREATE POLICY "Users can view arguments" ON arguments
    FOR SELECT USING (
        decision_id IN (
            SELECT id FROM decisions WHERE team_id IN (
                SELECT team_id FROM users WHERE id = auth.uid()
            )
        )
    );

CREATE POLICY "Users can create arguments" ON arguments
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- NOTIFICATIONS: Users can only see their own notifications
CREATE POLICY "Users can view their notifications" ON notifications
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their notifications" ON notifications
    FOR UPDATE USING (user_id = auth.uid());

-- AUDIT LOGS: Users can view team audit logs
CREATE POLICY "Users can view team audit logs" ON audit_logs
    FOR SELECT USING (
        decision_id IN (
            SELECT id FROM decisions WHERE team_id IN (
                SELECT team_id FROM users WHERE id = auth.uid()
            )
        ) OR decision_id IS NULL
    );
