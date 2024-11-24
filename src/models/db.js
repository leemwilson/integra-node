const mysql = require("mysql2");
const fs = require("fs");

// Create MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: {
    ca: fs.readFileSync("ca-certificate.crt"), // SSL certificate
  },
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool.promise(); // Use promise-based queries
