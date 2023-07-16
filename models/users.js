const pool = require('./database');

exports.get = async () => pool.query(
  'SELECT id, name, email, address, is_admin FROM users'
);

exports.getById = async (id) => pool.query(
  'SELECT id, name, email, address, is_admin FROM users WHERE id = $1',
  [id]
);