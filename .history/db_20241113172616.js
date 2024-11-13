
const { Client } = require('pg');

const client = new Client({
  user: 'postgres',  // username
  host: 'localhost',
  database: 'expense_management',  // Db name
  password: 'postgres',  // password
  port: 5432,
});

client.connect()
  .then(() => console.log('Connected to the PostgreSQL database'))
  .catch((err) => console.error('Database connection error', err.stack));

module.exports = client;
