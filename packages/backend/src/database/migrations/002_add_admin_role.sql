-- Migration 002: Add `role` column to `admins` table
-- Adds a non-nullable `role` column with a safe default and an index.

-- Add column if it doesn't already exist
ALTER TABLE admins
    ADD COLUMN IF NOT EXISTS role VARCHAR(50) NOT NULL DEFAULT 'admin';

-- Ensure existing rows have the default value (defensive)
UPDATE admins SET role = 'admin' WHERE role IS NULL;

-- Index for queries filtering by role
CREATE INDEX IF NOT EXISTS idx_admins_role ON admins USING btree (role);

-- Rollback helpers (manual):
-- ALTER TABLE admins DROP COLUMN IF EXISTS role;
-- DROP INDEX IF EXISTS idx_admins_role;

-- End of migration 002
