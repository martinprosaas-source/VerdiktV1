-- Beta registrations table (public landing page waitlist)
CREATE TABLE IF NOT EXISTS beta_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    company TEXT NOT NULL,
    website TEXT,
    team_size TEXT NOT NULL,
    plan TEXT NOT NULL,
    contact_preference TEXT NOT NULL DEFAULT 'email',
    phone TEXT,
    referral_code TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Allow anyone to insert (public waitlist)
ALTER TABLE beta_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can register for beta"
    ON beta_registrations
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Only service role can read registrations
CREATE POLICY "Service role can read beta registrations"
    ON beta_registrations
    FOR SELECT
    TO service_role
    USING (true);
