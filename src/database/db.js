// src/database/db.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Adicione este objeto para conexões na nuvem
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};