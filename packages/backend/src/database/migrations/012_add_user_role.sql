-- Migration 012: Add role column to applications and users tables
ALTER TABLE applications ADD COLUMN IF NOT EXISTS role VARCHAR(20) NOT NULL DEFAULT 'trainee';
ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) NOT NULL DEFAULT 'trainee';

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'check_applications_role'
    ) THEN
        ALTER TABLE applications ADD CONSTRAINT check_applications_role CHECK (role IN ('trainee', 'trainer'));
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'check_users_role'
    ) THEN
        ALTER TABLE users ADD CONSTRAINT check_users_role CHECK (role IN ('trainee', 'trainer'));
    END IF;
END $$;
