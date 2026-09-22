-- Migration 015: Add index for active game sessions heartbeat cleanup
CREATE INDEX IF NOT EXISTS idx_game_sessions_active_heartbeat
ON game_sessions (last_heartbeat_at)
WHERE session_ended_at IS NULL;
