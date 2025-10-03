import { Router } from "express";
import { completeLesson, getProgress, listProgressByStudent } from "../controllers/controllers.js";

const router = Router();

// Completar lección
router.post("/complete-lesson", completeLesson);

// Listar progreso de un estudiante
router.get("/by-student/:studentId", listProgressByStudent);

// Obtener progreso específico de un estudiante en un curso
router.get("/:studentId/:courseId", getProgress);

export default router;
