// src/models/certificatesModel.js
// ------------------------------
// Modelo de datos para la tabla `certificates`.
// Contiene funciones pequeñas, atómicas y reutilizables:
// - createCertificate: inserta fila (puede insertar content HTML en memoria).
// - updateCertificateContent: actualiza file_url y content.
// - getCertificatesByUser: lista metadatos de certificados de un usuario.
// - getCertificateContentById: obtiene contenido (HTML) de un certificado.
// NOTA: el controlador maneja control de errores; aquí devolvemos errores para que el caller los capture.
// ------------------------------

const pool = require("./db");

/**
 * * Inserta un certificado.
 * @returns {Number} id insertado
 */
async function createCertificate(
    userId,
    courseId,
    fileUrl = null,
    content = null
) {
    const [result] = await pool.query(
        "INSERT INTO certificates (userId, courseId, file_url, content) VALUES (?, ?, ?, ?)",
        [userId, courseId, fileUrl, content]
    );
    return result.insertId;
}

/**
 * * Actualiza file_url y content (HTML) del certificado.
 * Usado después de generar el HTML en memoria.
 */
async function updateCertificateContent(id, fileUrl, content) {
    await pool.query(
        "UPDATE certificates SET file_url = ?, content = ? WHERE id = ?",
        [fileUrl, content, id]
    );
}

/**
 * * Lista metadatos de certificados de un usuario.
 * Devuelve: [{ id, userId, courseId, issuedAt, file_url }, ...]
 */
async function getCertificatesByUser(userId) {
    const [rows] = await pool.query(
        "SELECT id, userId, courseId, issuedAt, file_url FROM certificates WHERE userId = ? ORDER BY issuedAt DESC",
        [userId]
    );
    return rows;
}

/**
 * * Trae el registro completo (incluye content).
 * Usado por el endpoint de descarga.
 */
async function getCertificateContentById(id) {
    const [rows] = await pool.query(
        "SELECT id, userId, courseId, issuedAt, file_url, content FROM certificates WHERE id = ?",
        [id]
    );
    return rows.length ? rows[0] : null;
}

module.exports = {
    createCertificate,
    updateCertificateContent,
    getCertificatesByUser,
    getCertificateContentById,
};
