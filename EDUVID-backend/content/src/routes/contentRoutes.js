const express = require("express");
const router = express.Router();
const contentController = require("../controllers/contentController");

// Crear lección
router.post("/", (req, res, next) => {
  console.log("➡️ [Router] POST / (createLesson)");
  next();
}, contentController.createLesson);

// Listar lecciones por curso
router.get("/", (req, res, next) => {
  console.log("➡️ [Router] GET / (getLessonsByCourse)");
  next();
}, contentController.getLessonsByCourse);

// Detalle de lección
router.get("/:id", (req, res, next) => {
  console.log(`➡️ [Router] GET /:id (getLessonById), ID recibido: ${req.params.id}`);
  next();
}, contentController.getLessonById);

module.exports = router;
