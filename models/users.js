const pool = require('./database');

exports.get = async () => pool.query(
  'SELECT id, name, email, address, is_admin FROM users'
);

exports.getById = async (id) => pool.query(
  'SELECT id, name, email, address, is_admin FROM users WHERE id = $1',
  [id]
);

exports.add = async (id, name, password, email, address) => pool.query(
  'INSERT INTO users (id, name, password, email, address, is_admin) VALUES ($1, $2, $3, $4, $5, $6)',
  [id, name, password, email, address, false]
);

exports.updateById = async (id, name, email, address) => pool.query(
  'UPDATE users SET name = $2, email = $3, address = $4 WHERE id = $1',
  [id, name, email, address]
);

exports.deleteById = async (id) => pool.query(
  'DELETE FROM users WHERE id = $1',
  [id]
);