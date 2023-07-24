const pool = require('./database');

exports.add = async (userId,productId,amount) => pool.query(
  'INSERT INTO cart_items (user_id, product_id, amount) VALUES ($1, $2, $3)',
  [userId,productId,amount]
);

exports.getByUserId = async (userId) => pool.query(
  'SELECT user_id, product_id, amount FROM cart_items WHERE user_id = $1',
  [userId]
);

exports.deleteByUserId = async (userId) => pool.query(
  'DELETE FROM cart_items WHERE user_id = $1',
  [userId]
);

exports.updateByUserIdAndProductId = async (userId,productId,amount) => pool.query(
  'UPDATE cart_items SET amount = $3 WHERE user_id = $1 AND product_id = $2',
  [userId,productId,amount]
);

exports.deleteByUserIdAndProductId = async (userId,productId) => pool.query(
  'DELETE FROM cart_items WHERE user_id = $1AND product_id = $2',
  [userId,productId]
);

//TODO: add load mock data
//TODO: add clear mock data