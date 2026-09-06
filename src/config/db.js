const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'medimascotas',
  connectionLimit: process.env.DB_POOL_LIMIT || 10,
  waitForConnections: true
});

// Comprobar la conexión al iniciar
pool.getConnection()
  .then(conn => {
    console.log('✅ Conexión exitosa a MySQL');
    conn.release();
  })
  .catch(err => {
    console.error('❌ Error al conectar con MySQL:', err.message);
  });

module.exports = pool;