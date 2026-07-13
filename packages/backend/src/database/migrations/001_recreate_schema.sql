-- Migration 001: Drop all tables and recreate clean schema according to new ERD
-- This migration drops everything and creates a fresh database structure

-- Step 1: Drop all existing tables, views, and triggers (CASCADE handles dependencies)
DROP VIEW IF EXISTS accepted_users_details CASCADE;
DROP VIEW IF EXISTS application_approvals_details CASCADE;
DROP TABLE IF EXISTS application_approvals CASCADE;
DROP TABLE IF EXISTS accepted_users CASCADE;
DROP TABLE IF EXISTS files CASCADE;
DROP TABLE IF EXISTS answers CASCADE;
DROP TABLE IF EXISTS applications CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS questions CASCADE;
DROP TABLE IF EXISTS admins CASCADE;

-- Step 2: Enable UUID extension for UUID primary keys
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Step 3: Create trigger function for updating timestamps
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 4: Create Admins table (SERIAL - internal admin accounts)
CREATE TABLE admins (
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    name TEXT,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    last_login_at TIMESTAMP WITH TIME ZONE,
    last_logout_at TIMESTAMP WITH TIME ZONE
);

-- Step 5: Create Questions table (SERIAL - internal questions)
CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    position INTEGER NOT NULL,
    text TEXT NOT NULL,
    active BOOLEAN DEFAULT TRUE
);

-- Step 6: Create Applications table (users apply via form)
-- Using UUID for privacy/security (user-facing data)
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    surname VARCHAR(100) NOT NULL,
    father_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    sex VARCHAR(20) NOT NULL,
    place_of_birth VARCHAR(100) NOT NULL,
    national_serial_num VARCHAR(20) NOT NULL UNIQUE,
    national_id_num VARCHAR(20) NOT NULL UNIQUE,
    phone_number VARCHAR(30) NOT NULL,
    email VARCHAR(100) NOT NULL,
    education_level VARCHAR(50) NOT NULL,
    university VARCHAR(100) NOT NULL,
    profession VARCHAR(100) NOT NULL,
    skills TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Step 7: Create Users table (real accounts for login)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    activated_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Step 8: Create Application_Approvals table
CREATE TABLE application_approvals (
    application_id UUID PRIMARY KEY REFERENCES applications(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    accepted_by INTEGER REFERENCES admins(id) ON DELETE SET NULL,
    secret_key VARCHAR(16) UNIQUE NOT NULL,
    accepted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    CONSTRAINT application_approvals_user_id_unique UNIQUE (user_id)
);

-- Step 9: Create Answers table
CREATE TABLE answers (
    id SERIAL PRIMARY KEY,
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    question_id INTEGER NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    answer TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    UNIQUE(application_id, question_id)
);

-- Step 10: Create Files table
CREATE TABLE files (
    id SERIAL PRIMARY KEY,
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    file_type VARCHAR(10) NOT NULL,
    file_size BIGINT NOT NULL,
    original_name TEXT NOT NULL,
    stored_name TEXT NOT NULL,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Step 11: Create indexes for performance
-- Admins indexes
CREATE UNIQUE INDEX admins_email_unique_idx ON admins USING btree (LOWER(email));

-- Applications indexes
CREATE INDEX idx_applications_email ON applications USING btree (email);
CREATE INDEX idx_applications_name ON applications USING btree (name);
CREATE INDEX idx_applications_surname ON applications USING btree (surname);
CREATE INDEX idx_applications_national_id ON applications USING btree (national_id_num);
CREATE INDEX idx_applications_national_serial ON applications USING btree (national_serial_num);
CREATE INDEX idx_applications_deleted_at ON applications USING btree (deleted_at);

-- Users indexes
CREATE UNIQUE INDEX idx_users_email_lower_unique ON users USING btree (LOWER(email));
CREATE INDEX idx_users_is_active ON users USING btree (is_active);
CREATE INDEX idx_users_created_at ON users USING btree (created_at);

-- Application_Approvals indexes
CREATE UNIQUE INDEX idx_application_approvals_secret_key_unique ON application_approvals USING btree (secret_key);
CREATE INDEX idx_application_approvals_accepted_at ON application_approvals USING btree (accepted_at);
CREATE INDEX idx_application_approvals_accepted_by ON application_approvals USING btree (accepted_by);

-- Answers indexes
CREATE INDEX idx_answers_application ON answers USING btree (application_id);
CREATE INDEX idx_answers_question ON answers USING btree (question_id);

-- Files indexes
CREATE INDEX idx_files_application ON files USING btree (application_id);
CREATE INDEX idx_files_type ON files USING btree (file_type);

-- Questions indexes
CREATE INDEX idx_questions_active ON questions USING btree (active);
CREATE INDEX idx_questions_position ON questions USING btree (position);

-- Step 12: Create triggers for updated_at
CREATE TRIGGER admins_set_updated_at
    BEFORE UPDATE ON admins
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER applications_set_updated_at
    BEFORE UPDATE ON applications
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER users_set_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER application_approvals_set_updated_at
    BEFORE UPDATE ON application_approvals
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER answers_set_updated_at
    BEFORE UPDATE ON answers
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

-- Step 13: Create validation triggers and constraints
-- Trigger to prevent duplicate active questions at same position
CREATE OR REPLACE FUNCTION check_question_position()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.active = TRUE THEN
        IF EXISTS (
            SELECT 1 FROM questions 
            WHERE position = NEW.position 
            AND active = TRUE 
            AND id != COALESCE(NEW.id, 0)
        ) THEN
            RAISE EXCEPTION 'An active question already exists at position %', NEW.position;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER question_position_check
    BEFORE INSERT OR UPDATE ON questions
    FOR EACH ROW
    EXECUTE FUNCTION check_question_position();

-- Trigger to validate file types
CREATE OR REPLACE FUNCTION validate_file_type()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.file_type NOT IN ('pdf', 'mp4') THEN
        RAISE EXCEPTION 'Invalid file type: %. Only pdf and mp4 are allowed', NEW.file_type;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER file_type_validation
    BEFORE INSERT OR UPDATE ON files
    FOR EACH ROW
    EXECUTE FUNCTION validate_file_type();

-- Trigger to validate phone number format
CREATE OR REPLACE FUNCTION validate_phone_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.phone_number !~ '^\+994\d{9}' THEN
        RAISE EXCEPTION 'Invalid phone number format: %. Must be +994XXXXXXXXX', NEW.phone_number;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER phone_number_validation
    BEFORE INSERT OR UPDATE ON applications
    FOR EACH ROW
    EXECUTE FUNCTION validate_phone_number();

-- Step 14: Add check constraints
ALTER TABLE applications ADD CONSTRAINT check_sex 
    CHECK (sex IN ('male', 'female', 'other'));

ALTER TABLE files ADD CONSTRAINT check_file_size 
    CHECK (file_size > 0 AND file_size <= 21474836480); -- 20GB max

ALTER TABLE questions ADD CONSTRAINT check_position 
    CHECK (position > 0);

-- Step 15: Create helpful view for application approvals details
CREATE OR REPLACE VIEW application_approvals_details AS
SELECT 
    aa.application_id,
    aa.user_id,
    aa.accepted_by,
    aa.secret_key,
    aa.accepted_at,
    aa.created_at,
    aa.updated_at,
    a.name,
    a.surname,
    a.father_name,
    a.date_of_birth,
    a.sex,
    a.place_of_birth,
    a.national_serial_num,
    a.national_id_num,
    a.phone_number,
    a.email,
    a.education_level,
    a.university,
    a.profession,
    a.skills,
    a.created_at as application_created_at,
    a.deleted_at,
    u.email as login_email,
    u.is_active as user_is_active,
    admin.name as accepted_by_admin_name
FROM application_approvals aa
INNER JOIN applications a ON a.id = aa.application_id
LEFT JOIN users u ON u.id = aa.user_id
LEFT JOIN admins admin ON admin.id = aa.accepted_by
WHERE a.deleted_at IS NULL;

