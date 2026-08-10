BEGIN;

ALTER TABLE game_sessions
ADD COLUMN last_heartbeat_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW();

CREATE INDEX idx_game_sessions_last_heartbeat_at ON game_sessions(last_heartbeat_at);

COMMIT;
