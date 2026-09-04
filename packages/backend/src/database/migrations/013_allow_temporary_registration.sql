-- Temporary registration mode: legacy application fields may be omitted.
ALTER TABLE applications
    ALTER COLUMN father_name DROP NOT NULL,
    ALTER COLUMN date_of_birth DROP NOT NULL,
    ALTER COLUMN sex DROP NOT NULL,
    ALTER COLUMN place_of_birth DROP NOT NULL,
    ALTER COLUMN national_serial_num DROP NOT NULL,
    ALTER COLUMN education_level DROP NOT NULL,
    ALTER COLUMN university DROP NOT NULL,
    ALTER COLUMN profession DROP NOT NULL;