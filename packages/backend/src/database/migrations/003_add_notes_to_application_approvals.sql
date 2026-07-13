-- Migration 003: Add `notes` column to `application_approvals` table
-- Adds an optional text field for human-readable notes about approvals.

-- Add the column if it does not already exist
ALTER TABLE application_approvals
    ADD COLUMN IF NOT EXISTS notes TEXT;

-- Defensive: ensure existing rows are initialized (no-op for NULL default)
UPDATE application_approvals SET notes = NULL WHERE notes IS NULL;

-- Rollback helpers (manual):
-- ALTER TABLE application_approvals DROP COLUMN IF EXISTS notes;

-- End of migration 003
