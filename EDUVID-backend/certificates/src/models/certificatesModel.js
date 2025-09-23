const pool = require("./db");

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

async function updateCertificateContent(id, fileUrl, content) {
    await pool.query(
        "UPDATE certificates SET file_url = ?, content = ? WHERE id = ?",
        [fileUrl, content, id]
    );
}

async function getCertificatesByUser(userId) {
    const [rows] = await pool.query(
        "SELECT id, userId, courseId, issuedAt, file_url FROM certificates WHERE userId = ? ORDER BY issuedAt DESC",
        [userId]
    );
    return rows;
}

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
