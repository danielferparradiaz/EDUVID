// src/routes/contentRoutes.js
import express from "express";
import {
  createLesson,
  getLessonsByCourse,
  getLessonById,
  updateLesson,
  deleteLesson
} from "../controllers/contentController.js";

const router = express.Router();

// Crear lección
router.post("/", (req, res, next) => {
  console.log("➡️ [Router] POST / (createLesson)");
  next();
}, createLesson);

// Listar lecciones por curso
router.get("/", (req, res, next) => {
  console.log("➡️ [Router] GET / (getLessonsByCourse)");
  next();
}, getLessonsByCourse);

// Detalle de lección
router.get("/:id", (req, res, next) => {
  console.log(`➡️ [Router] GET /:id (getLessonById), ID recibido: ${req.params.id}`);
  next();
}, getLessonById);

// Actualizar lección
router.put("/:id", updateLesson);

// Eliminar lección
router.delete("/:id", deleteLesson);

export default router;
