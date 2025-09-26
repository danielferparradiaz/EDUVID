const express = require("express");
const router = express.Router();
const contentController = require("../controllers/contentController");

// Crear lección
router.post("/", contentController.createLesson);

// Listar lecciones por curso
router.get("/", contentController.getLessonsByCourse);

// Detalle de lección
router.get("/:id", contentController.getLessonById);

module.exports = router;
