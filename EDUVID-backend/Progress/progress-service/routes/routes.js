import { Router } from "express";
import { completeLesson, getProgress } from "../controllers/controllers.js";

const router = Router();

router.post("/complete-lesson", completeLesson);



router.get("/", getProgress);



export default router;
