-- Add ai_summary column to decisions table
ALTER TABLE decisions ADD COLUMN IF NOT EXISTS ai_summary JSONB;
