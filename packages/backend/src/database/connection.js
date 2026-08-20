// Load environment variables before requiring database config
require('dotenv').config();

const fs = require('fs');
const path = require('path');
const db = require('../config/database');

class DatabaseConnection {
  async testConnection() {
    try {
      await db.query('SELECT NOW()');
      console.log('Database connected successfully');
      return true;
    } catch (error) {
      console.error('Database connection failed:', error);
      return false;
    }
  }

  async ensureMigrationsTable(client) {
    const sql = `
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id SERIAL PRIMARY KEY,
        migration_name VARCHAR(255) UNIQUE NOT NULL,
        executed_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `;
    await client.query(sql);
  }

  async getExecutedMigrations() {
    const client = await db.connect();
    try {
      await this.ensureMigrationsTable(client);
      const { rows } = await client.query(
        'SELECT migration_name FROM schema_migrations ORDER BY id',
      );
      return rows.map((row) => row.migration_name);
    } finally {
      client.release();
    }
  }

  async runMigrations() {
    try {
      console.log('🚀 Starting database migrations...\n');

      const migrationsDir = path.join(__dirname, 'migrations');
      const files = fs
        .readdirSync(migrationsDir)
        .filter((file) => file.endsWith('.sql'))
        .sort();

      if (files.length === 0) {
        console.log('No migration files found.');
        return;
      }

      const executedMigrations = await this.getExecutedMigrations();
      const pendingMigrations = files.filter(
        (file) => !executedMigrations.includes(file),
      );

      if (pendingMigrations.length === 0) {
        console.log('✅ All migrations are up to date.\n');
        return;
      }

      console.log(`Found ${pendingMigrations.length} pending migration(s):\n`);

      for (const file of pendingMigrations) {
        const filePath = path.join(migrationsDir, file);
        const sql = fs.readFileSync(filePath, 'utf8');

        console.log(`📝 Running migration: ${file}`);

        const client = await db.connect();
        try {
          await client.query('BEGIN');
          // Ensure migrations table exists before executing migration
          await this.ensureMigrationsTable(client);
          await client.query(sql);
          await client.query(
            'INSERT INTO schema_migrations (migration_name) VALUES ($1) ON CONFLICT (migration_name) DO NOTHING',
            [file],
          );
          await client.query('COMMIT');

          console.log(`✅ Successfully executed: ${file}\n`);
        } catch (error) {
          await client.query('ROLLBACK');
          console.error(`❌ Error executing migration ${file}:`, error.message);
          throw error;
        } finally {
          client.release();
        }
      }

      console.log('🎉 All migrations completed successfully!\n');
    } catch (error) {
      console.error('💥 Migration failed:', error);
      throw error;
    }
  }
}

module.exports = new DatabaseConnection();
