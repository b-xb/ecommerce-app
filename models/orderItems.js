const pool = require('./database');

exports.getByOrderId = async (orderId) => pool.query(
  'SELECT order_id, product_id, amount, unit_price, total_cost FROM order_items WHERE order_id = $1',
  [orderId]
);

exports.deleteByOrderId = async (orderId) => pool.query(
  'DELETE FROM order_items WHERE order_id = $1',
  [orderId]
);

exports.getByOrderIdAndProductId = async (orderId,productId) => pool.query(
  'SELECT order_id, product_id, amount, unit_price, total_cost FROM order_items WHERE order_id = $1 AND product_id = $2',
  [orderId,productId]
);

exports.deleteByOrderIdAndProductId = async (orderId,productId) => pool.query(
  'DELETE FROM order_items WHERE order_id = $1 AND product_id = $2',
  [orderId,productId]
);