BEGIN;

-- =========================
-- Maps (gameplay maps / levels)
-- =========================
CREATE TABLE maps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    code VARCHAR(100) UNIQUE NOT NULL, -- e.g. drone_training_01
    name VARCHAR(255) NOT NULL,
    description TEXT,

    required_orb_count INTEGER NOT NULL,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_maps_code ON maps(code);


-- =========================
-- Map runs (objective-based attempts)
-- =========================
CREATE TABLE map_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

    game_session_id UUID
        REFERENCES game_sessions(id)
        ON DELETE SET NULL,

    map_id UUID NOT NULL
        REFERENCES maps(id)
        ON DELETE CASCADE,

    run_started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    run_ended_at TIMESTAMP WITH TIME ZONE,

    objective_time_seconds INTEGER,

    collected_orbs INTEGER DEFAULT 0,

    completed BOOLEAN DEFAULT FALSE,

    end_reason VARCHAR(50),

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,

    -- consistency checks
    CONSTRAINT chk_completed_requires_end
        CHECK (
            completed = FALSE
            OR (run_ended_at IS NOT NULL AND objective_time_seconds IS NOT NULL)
        )
);

CREATE INDEX idx_map_runs_user ON map_runs(user_id);
CREATE INDEX idx_map_runs_map ON map_runs(map_id);
CREATE INDEX idx_map_runs_session ON map_runs(game_session_id);
CREATE INDEX idx_map_runs_completed ON map_runs(map_id, completed);

COMMIT;
