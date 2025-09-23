// src/models/db.js
// ------------------------------
// Crea y exporta un pool de conexiones MySQL usando mysql2/promise.
// - Usar pool evita abrir/cerrar conexiones en cada query.
// - Las credenciales se leen desde process.env (archivo .env en la raíz).
// - Si el equipo cambia DB, actualizan sólo .env.
// ------------------------------

const mysql = require("mysql2/promise");

const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "",
    database: process.env.DB_NAME || "certificates_db",
    waitForConnections: true,
    connectionLimit: 10,
});

module.exports = pool;
