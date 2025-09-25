import { Router } from "express";
import { enrollUser, validateEnrollment } from "../controllers/enrollmentsController.js";

const router = Router();

router.post("/enrollUser", enrollUser);
router.get("/validate-enroll/:userId/:courseId", validateEnrollment);

export default router;

