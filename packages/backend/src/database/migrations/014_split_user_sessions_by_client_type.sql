-- Migration 014: Split session_id into web_session_id and game_session_id for independent sessions
ALTER TABLE users ADD COLUMN IF NOT EXISTS web_session_id UUID;
ALTER TABLE users ADD COLUMN IF NOT EXISTS game_session_id UUID;

-- Backfill web_session_id from existing session_id if present
UPDATE users
SET web_session_id = session_id
WHERE web_session_id IS NULL AND session_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_users_web_session_id ON users (web_session_id);
CREATE INDEX IF NOT EXISTS idx_users_game_session_id ON users (game_session_id);
