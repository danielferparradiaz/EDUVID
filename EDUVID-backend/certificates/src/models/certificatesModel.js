// src/models/certificatesModel.js
// ------------------------------
// Modelo de datos para la tabla `certificates` usando Sequelize.
// ------------------------------
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.js"); // tu instancia sequelize

const Certificate = sequelize.define("Certificate", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  studentName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  courseName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  issueDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

// ------------------------------
// Funciones utilitarias
// ------------------------------

/**
 * Inserta un certificado.
 */
async function createCertificate(userId, courseId, fileUrl = null, content = null) {
  const cert = await Certificate.create({ userId, courseId, file_url: fileUrl, content });
  return cert.id;
}

/**
 * Actualiza file_url y content.
 */
async function updateCertificateContent(id, fileUrl, content) {
  const cert = await Certificate.findByPk(id);
  if (!cert) throw new Error("Certificate not found");
  cert.file_url = fileUrl;
  cert.content = content;
  await cert.save();
  return cert;
}

/**
 * Lista certificados de un usuario.
 */
async function getCertificatesByUser(userId) {
  return await Certificate.findAll({
    attributes: ["id", "userId", "courseId", "issuedAt", "file_url"],
    where: { userId },
    order: [["issuedAt", "DESC"]],
  });
}

/**
 * Trae un certificado completo.
 */
async function getCertificateContentById(id) {
  return await Certificate.findByPk(id, {
    attributes: ["id", "userId", "courseId", "issuedAt", "file_url", "content"],
  });
}

// Exportar en CommonJS
module.exports = {
  Certificate,
  createCertificate,
  updateCertificateContent,
  getCertificatesByUser,
  getCertificateContentById,
};
