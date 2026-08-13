-- Migration: Fix and sync auto-increment sequences for answers and other tables
-- Description: Ensures serial primary key sequences (like answers_id_seq) match MAX(id) to avoid duplicate key violations (code 23505)

DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN 
        SELECT table_name, column_name, sequence_name 
        FROM (
            SELECT 
                t.table_name, 
                c.column_name, 
                pg_get_serial_sequence(t.table_name, c.column_name) AS sequence_name
            FROM information_schema.tables t
            JOIN information_schema.columns c ON t.table_name = c.table_name
            WHERE t.table_schema = 'public'
        ) s
        WHERE sequence_name IS NOT NULL
    LOOP
        EXECUTE format(
            'SELECT setval(%L, COALESCE((SELECT MAX(%I) FROM %I), 1), true);', 
            r.sequence_name, r.column_name, r.table_name
        );
    END LOOP;
END $$;
