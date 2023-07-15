const { Pool } = require('pg');

let pool;

if (process.env.NODE_ENV==="test") {
  pool = new Pool({
    user: process.env.TEST_DB_USER,
    host: process.env.TEST_DB_HOST,
    database: process.env.TEST_DB_DATABASE,
    password: process.env.TEST_DB_PASSWORD,
    port: process.env.TEST_DB_PORT,
  });
} else {
  pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });
}

module.exports = pool;