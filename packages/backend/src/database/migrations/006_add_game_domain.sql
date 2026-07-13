BEGIN;

CREATE TABLE game_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

    session_started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    session_ended_at TIMESTAMP WITH TIME ZONE,

    duration_seconds INTEGER, -- computed on end
    end_reason VARCHAR(50), -- quit, crash, disconnect, timeout

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_game_sessions_user ON game_sessions(user_id);
CREATE INDEX idx_game_sessions_started_at ON game_sessions(session_started_at);

COMMIT;
