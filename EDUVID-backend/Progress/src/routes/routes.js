import { Router } from "express";
import { completeLesson, getprogress } from "/Users/danielfernandoparradiaz/Downloads/UAO/3ro/REDES E INFRA/EDUVID/EDUVID-backend/progress/src/controllers/controllers.js";

const router = Router();

router.post("/complete-lesson", completeLesson);

router.get("/", getprogress);



export default router;
