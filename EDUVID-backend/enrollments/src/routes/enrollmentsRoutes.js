import { Router } from "express";
import { enrollUser, validateEnrollment } from "../controllers/enrollmentsController.js";

const router = Router();

// Middleware de log de entrada a la ruta
router.use((req, res, next) => {
  console.log(`➡️ [EnrollmentsRouter] ${req.method} ${req.originalUrl}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log("📦 [EnrollmentsRouter] Body recibido:", req.body);
  }
  next();
});

router.post("/enrollUser", (req, res, next) => {
  console.log("🚀 [EnrollmentsRouter] POST /enrollUser invocado");
  next();
}, enrollUser);

router.get("/validate-enroll/:userId/:courseId", (req, res, next) => {
  console.log("🚀 [EnrollmentsRouter] GET /validate-enroll invocado con params:", req.params);
  next();
}, validateEnrollment);

export default router;
