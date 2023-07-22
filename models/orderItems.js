const pool = require('./database');

exports.add = async (orderId,productId,amount,unitPrice,totalCost) => pool.query(
  'INSERT INTO order_items (order_id, product_id, amount, unit_price, total_cost) VALUES ($1, $2, $3, $4, $5)',
  [orderId,productId,amount,unitPrice,totalCost]
);

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

exports.updateByOrderIdAndProductId= async (orderId,productId,amount,unitPrice) => pool.query(
  'UPDATE order_items SET amount = $3, unit_price = $4, total_cost = $5 WHERE order_id = $1 AND product_id = $2',
  [orderId,productId,amount,unitPrice,amount*unitPrice]
);

exports.deleteByOrderIdAndProductId = async (orderId,productId) => pool.query(
  'DELETE FROM order_items WHERE order_id = $1 AND product_id = $2',
  [orderId,productId]
);