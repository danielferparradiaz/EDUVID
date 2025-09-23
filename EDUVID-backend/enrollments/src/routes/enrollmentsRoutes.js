import { Router } from "express";
import { enrollUser, getEnrollmentByUserId } from "../controllers/enrollmentsController.js";

const router = Router();

router.post("/enrollUser",enrollUser);
router.get("/getEnrollmentByUserId", getEnrollmentByUserId);

export default router;

