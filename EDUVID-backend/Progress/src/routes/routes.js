import { Router } from "express";
import { completeLesson, getprogress } from "../controllers/controllers.js";

const router = Router();

router.post("/complete-lesson", completeLesson);

router.get("/", getprogress);



export default router;
