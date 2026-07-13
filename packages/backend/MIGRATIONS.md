# Database Migrations Guide

This document explains how to run database migrations for the Semadaki Gözler backend.

## Overview

The migration system automatically tracks which migrations have been executed using a `schema_migrations` table. Migrations are run in numerical order based on their filename prefix (e.g., `001_`, `002_`, etc.).

## Running Migrations

### Using npm script (Recommended)

```bash
cd packages/backend
npm run migrate
```

Or using the alias:

```bash
npm run db:migrate
```

### Manual execution

```bash
cd packages/backend
node -e "require('./src/database/connection').runMigrations()"
```

## Migration Files

Migrations are located in `src/database/migrations/` and are executed in alphabetical order:

- `001_recreate_schema.sql` - **Drops all tables and recreates clean schema** according to new ERD

## Migration 001 - Complete Schema Rebuild

Migration 001 performs a complete database rebuild:

1. **Drops all existing tables**: Removes all old tables, views, and triggers (CASCADE handles dependencies)
2. **Creates fresh schema** according to the new ERD:
   - `admins` - Admin accounts (SERIAL id)
   - `applications` - User applications (form submissions, UUID id)
   - `users` - Real login accounts (UUID primary key)
   - `application_approvals` - Links applications to users with secret_key
   - `answers` - Application answers (references applications)
   - `files` - Uploaded files (references applications)
   - `questions` - Questions for applications (SERIAL id)
3. **Creates all indexes** for performance
4. **Sets up all triggers** for updated_at and validation
5. **Creates constraints** for data integrity
6. **Creates helpful views** like `application_approvals_details`

## ⚠️ Important Notes

- Migration 001 **drops all existing data** - make sure you're okay with this!
- Migrations are **idempotent** - running them multiple times is safe (they track execution)
- Migrations run in a **transaction** - if any migration fails, all changes are rolled back
- The migration system creates a `schema_migrations` table automatically to track executed migrations

## Schema Structure

After migration 001, your schema will be:

- **`admins`**: Admin accounts for managing the system (SERIAL id)
- **`applications`**: User application data (form submissions, UUID id)
- **`users`**: Login/authentication accounts (UUID primary key)
- **`application_approvals`**: Links applications to users, stores `secret_key`
- **`answers`**: Answers to questions (references `applications`)
- **`files`**: Uploaded files (references `applications`)
- **`questions`**: Questions for applications (SERIAL id)

## Troubleshooting

### Check migration status

You can check which migrations have been executed by querying the database:

```sql
SELECT * FROM schema_migrations ORDER BY id;
```

### Reset migrations (Development only!)

If you need to reset migrations in development:

```sql
DROP TABLE IF EXISTS schema_migrations CASCADE;
```

Then re-run migrations.

### Manual migration execution

If you need to run a specific migration manually, you can execute the SQL file directly:

```bash
psql -U your_user -d your_database -f src/database/migrations/001_recreate_schema.sql
```
