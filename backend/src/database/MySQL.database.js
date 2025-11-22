const mysql = require('mysql2/promise');
const config = require('../config/db.conf');

const pool = mysql.createPool(config);

async function testConnection() {
  try {
    const conn = await pool.getConnection();
    await conn.ping();
    conn.release();
    console.log('[db] MySQL pool ready');
  } catch (e) {
    console.warn('[db] MySQL connection test failed:', e.message);
  }
}

// Kick off test (non-blocking)
if (process.env.NODE_ENV !== 'test') {
  testConnection();
}

module.exports = pool;
