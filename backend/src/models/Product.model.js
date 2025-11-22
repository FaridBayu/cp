const pool = require('../database/MySQL.database');

// Table: products
// Columns suggestion: id INT AUTO_INCREMENT PK, name VARCHAR(128), unit VARCHAR(32), base_price DECIMAL(12,2), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

async function findAll() {
  const [rows] = await pool.query('SELECT id, name, unit, base_price, created_at, updated_at FROM products ORDER BY id DESC');
  return rows;
}

async function findById(id) {
  const [rows] = await pool.query('SELECT id, name, unit, base_price, created_at, updated_at FROM products WHERE id=? LIMIT 1', [id]);
  return rows[0] || null;
}

async function create(data) {
  const { name, unit, base_price } = data;
  const [result] = await pool.query('INSERT INTO products (name, unit, base_price) VALUES (?,?,?)', [name, unit, base_price]);
  return findById(result.insertId);
}

async function update(id, data) {
  const { name, unit, base_price } = data;
  await pool.query('UPDATE products SET name=?, unit=?, base_price=? WHERE id=?', [name, unit, base_price, id]);
  return findById(id);
}

async function remove(id) {
  await pool.query('DELETE FROM products WHERE id=?', [id]);
  return true;
}

module.exports = { findAll, findById, create, update, remove };
