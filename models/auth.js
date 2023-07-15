const pool = require('./database');

exports.register = async (id, name, password, email, address) => pool.query(
  'INSERT INTO users (id, name, password, email, address, is_admin) VALUES ($1, $2, $3, $4, $5, $6)',
  [id, name, password, email, address, false]
);

exports.login = async (email, password) => pool.query(
  'SELECT id, name, email, address FROM users WHERE email = $1 AND password = $2',
  [email, password]
);