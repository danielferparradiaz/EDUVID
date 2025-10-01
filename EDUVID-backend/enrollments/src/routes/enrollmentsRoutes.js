import { Router } from "express";
import { enrollUser, validateEnrollment } from "../controllers/enrollmentsController.js";

const router = Router();

// Middleware de log
router.use((req, res, next) => {
  console.log(`➡️ [EnrollmentsRouter] ${req.method} ${req.originalUrl}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log("📦 [EnrollmentsRouter] Body recibido:", req.body);
  }
  next();
});

// 👉 Crear una inscripción

router.post("/enroll", enrollUser);

// 👉 Validar si un usuario está inscrito en un curso
router.get("/validate/:userId/:courseId", validateEnrollment);

export default router;
