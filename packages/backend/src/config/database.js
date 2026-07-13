const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
  max: process.env.DB_MAX_CONNECTIONS || 20,
  idleTimeoutMillis: process.env.DB_IDLE_TIMEOUT || 30000,
  connectionTimeoutMillis: process.env.DB_CONNECTION_TIMEOUT || 2000,
  // ssl: {
  //   rejectUnauthorized: false,
  // },
});

pool.on('connect', (client) => {
  client.query("SET TIME ZONE 'Asia/Baku'").catch(() => {
    // If timezone setup fails, continue using default session timezone.
  });
});

async function withTransaction(fn) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

module.exports = pool;
module.exports.withTransaction = withTransaction;
