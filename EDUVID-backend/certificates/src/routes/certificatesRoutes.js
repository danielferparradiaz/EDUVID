// src/routes/certificatesRoutes.js
// ------------------------------
// Router de Express para Certificates.
// Mantener simple: cada ruta apunta a una función del controller.
// Si el equipo quiere añadir autenticación, este es el lugar para insertar middleware.
// ------------------------------

const express = require("express");
const router = express.Router();
const controller = require("../controllers/certificatesController");

router.get("/", controller.listCertificates); // ?userId=
router.post("/generate", controller.generateCertificate); // body: { userId, courseId }
router.post("/simulate-event", controller.simulateEvent); // body: { userId, courseId } -> solo pruebas
router.get("/:id/download", controller.downloadCertificate); // descarga directo desde DB

module.exports = router;
