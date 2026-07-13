BEGIN;

-- 1. Add new columns as NULLABLE
ALTER TABLE application_approvals
    ADD COLUMN activation_token_hash TEXT,
    ADD COLUMN activation_expires_at TIMESTAMPTZ,
    ADD COLUMN activation_used_at TIMESTAMPTZ;

-- 2. Backfill existing rows
-- For already-approved applications, mark them as "used"
UPDATE application_approvals
SET
    activation_token_hash = encode(gen_random_bytes(32), 'hex'),
    activation_expires_at = NOW(),
    activation_used_at = accepted_at;

-- 3. Enforce constraints AFTER data exists
ALTER TABLE application_approvals
    ALTER COLUMN activation_token_hash SET NOT NULL,
    ALTER COLUMN activation_expires_at SET NOT NULL;

-- 4. (Optional but recommended) drop old insecure column
-- for future security, we no longer store the secret_key
-- ALTER TABLE application_approvals
--     DROP COLUMN secret_key;

COMMIT;
