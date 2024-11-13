const { Pool } = require('pg');

// Setup database connection
const pool = new Pool({
  user: 'postgres',          // PostgreSQL username
  host: 'localhost',
  database: 'expense_management',  // Your database name
  password: 'db123',         // The password you set for the user
  port: 5432,
});

module.exports = pool;
