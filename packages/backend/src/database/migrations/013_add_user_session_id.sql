-- Migration 013: Add session_id to users table for single active session enforcement
ALTER TABLE users ADD COLUMN IF NOT EXISTS session_id UUID;
CREATE INDEX IF NOT EXISTS idx_users_session_id ON users (session_id);
