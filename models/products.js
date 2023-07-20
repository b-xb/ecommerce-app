const pool = require('./database');

exports.get = async () => pool.query(
  'SELECT id, name, description, unit_price, stock FROM products'
);

exports.getById = async (id) => pool.query(
  'SELECT id, name, description, unit_price, stock FROM products WHERE id = $1',
  [id]
);

exports.add = async (id, name, description, unitPrice, stock) => pool.query(
  'INSERT INTO products (id, name, description, unit_price, stock) VALUES ($1, $2, $3, $4, $5)',
  [id, name, description, unitPrice, stock]
);

exports.updateById = async (id, name, description, unitPrice, stock) => pool.query(
  'UPDATE products SET name = $2, description = $3, unit_price = $4, stock = $5 WHERE id = $1',
  [id, name, description, unitPrice, stock]
);

exports.deleteById = async (id) => pool.query(
  'DELETE FROM products WHERE id = $1',
  [id]
);