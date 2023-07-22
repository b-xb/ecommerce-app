const pool = require('./database');

exports.get = async () => pool.query(
  'SELECT id, user_id, created, status FROM orders'
);

exports.getById = async (id) => pool.query(
  'SELECT id, user_id, created, status FROM orders WHERE id = $1',
  [id]
);

exports.getByUserId = async (userId) => pool.query(
  'SELECT id, user_id, created, status FROM orders WHERE user_id = $1',
  [userId]
);

exports.add = async (id, userId, created, status) => pool.query(
  'INSERT INTO orders (id, user_id, created, status) VALUES ($1, $2, $3, $4)',
  [id, userId, created, status]
);

exports.updateStatusById = async (id, status) => pool.query(
  'UPDATE orders SET status = $2 WHERE id = $1',
  [id, status]
);

exports.deleteById = async (id) => pool.query(
  'DELETE FROM orders WHERE id = $1',
  [id]
);

exports.deleteByUserId = async (userId) => pool.query(
  'DELETE FROM orders WHERE user_id = $1',
  [userId]
);