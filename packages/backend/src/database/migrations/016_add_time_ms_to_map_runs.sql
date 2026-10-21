-- Migration 016: Add time_ms to map_runs and index for personal best lookups
ALTER TABLE map_runs ADD COLUMN IF NOT EXISTS time_ms BIGINT;

-- Backfill time_ms from objective_time_seconds for existing rows
UPDATE map_runs
SET time_ms = (objective_time_seconds::BIGINT * 1000)
WHERE time_ms IS NULL AND objective_time_seconds IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_map_runs_user_map_best
ON map_runs (user_id, map_id, completed, time_ms);
