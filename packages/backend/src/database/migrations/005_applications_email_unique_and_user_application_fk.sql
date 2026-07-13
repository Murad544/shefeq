BEGIN;

-- 1️⃣ Remove non-unique email index on applications (if exists)
DROP INDEX IF EXISTS idx_applications_email;

-- 2️⃣ Add case-insensitive UNIQUE constraint for active applications only
CREATE UNIQUE INDEX idx_applications_email_unique_active
ON applications (LOWER(email))
WHERE deleted_at IS NULL;

-- 3️⃣ Add application_id to users table
ALTER TABLE users
ADD COLUMN application_id UUID;

-- 4️⃣ Enforce one-to-one relationship (one application → one user)
ALTER TABLE users
ADD CONSTRAINT users_application_id_unique UNIQUE (application_id);

-- 5️⃣ Add foreign key constraint (user must come from an application)
ALTER TABLE users
ADD CONSTRAINT fk_users_application
FOREIGN KEY (application_id)
REFERENCES applications(id)
ON DELETE RESTRICT;

COMMIT;
