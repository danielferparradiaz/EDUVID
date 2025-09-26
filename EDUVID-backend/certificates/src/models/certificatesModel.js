// src/models/certificatesModel.js
// ------------------------------
// Modelo de datos para la tabla `certificates` usando Sequelize.
// Incluye funciones atómicas y reutilizables:
// - createCertificate
// - updateCertificateContent
// - getCertificatesByUser
// - getCertificateContentById
// ------------------------------

import { DataTypes } from "sequelize";
import sequelize from "./db.js"; // tu instancia sequelize

const Certificate = sequelize.define(
  "Certificate",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    file_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    content: {
      type: DataTypes.TEXT("long"), // HTML puede ser grande
      allowNull: true,
    },
    issuedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "certificates",
    timestamps: false, // ya usamos issuedAt manual
  }
);

// ------------------------------
// Funciones utilitarias
// ------------------------------

/**
 * Inserta un certificado.
 * @returns {Object} registro creado
 */
async function createCertificate(userId, courseId, fileUrl = null, content = null) {
  return await Certificate.create({ userId, courseId, file_url: fileUrl, content });
}

/**
 * Actualiza file_url y content (HTML) del certificado.
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
 * Lista metadatos de certificados de un usuario.
 */
async function getCertificatesByUser(userId) {
  return await Certificate.findAll({
    attributes: ["id", "userId", "courseId", "issuedAt", "file_url"],
    where: { userId },
    order: [["issuedAt", "DESC"]],
  });
}

/**
 * Trae el registro completo (incluye content).
 */
async function getCertificateContentById(id) {
  return await Certificate.findByPk(id, {
    attributes: ["id", "userId", "courseId", "issuedAt", "file_url", "content"],
  });
}

export {
  Certificate,
  createCertificate,
  updateCertificateContent,
  getCertificatesByUser,
  getCertificateContentById,
};
