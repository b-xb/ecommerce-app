const pool = require('./database');

exports.get = async () => pool.query(
  'SELECT id, user_id, created, status FROM orders'
);

exports.getById = async (id) => pool.query(
  'SELECT id, user_id, created, status FROM orders WHERE id = $1',
  [id]
);

exports.add = async (id, userId, created, status) => pool.query(
  'INSERT INTO orders (id, user_id, created, status) VALUES ($1, $2, $3, $4)',
  [id, userId, created, status]
);

exports.updateById = async (id, userId, created, status) => pool.query(
  'UPDATE orders SET user_id = $2, created = $3, status = $4 WHERE id = $1',
  [id, userId, created, status]
);

exports.deleteById = async (id) => pool.query(
  'DELETE FROM orders WHERE id = $1',
  [id]
);