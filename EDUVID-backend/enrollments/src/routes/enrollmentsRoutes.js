import { Router } from "express";
import { enrollUser, validateEnrollment, getEnrollmentsByStudent } from "../controllers/enrollmentsController.js";

const router = Router();

// Middleware de log de entrada a la ruta
router.use((req, res, next) => {
  console.log(`➡️ [EnrollmentsRouter] ${req.method} ${req.originalUrl}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log("📦 [EnrollmentsRouter] Body recibido:", req.body);
  }
  next();
});

// Inscribir estudiante en un curso
router.post("/enrollUser", (req, res, next) => {
  console.log("🚀 [EnrollmentsRouter] POST /enrollUser invocado");
  next();
}, enrollUser);

// Validar si un estudiante está inscrito en un curso
router.get("/validate-enroll/:userId/:courseId", (req, res, next) => {
  console.log("🚀 [EnrollmentsRouter] GET /validate-enroll invocado con params:", req.params);
  next();
}, validateEnrollment);

router.get("/by-student/:studentId", (req, res, next) => {
  console.log("🚀 [EnrollmentsRouter] GET /by-student invocado con params:", req.params);
  next();
}, getEnrollmentsByStudent);

export default router;
