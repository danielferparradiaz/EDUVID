import { Router } from "express";
import { validateUserById } from "../controllers/userController.js";

const router = Router();

router.get("/validate-user/:id", validateUserById);


export default router;  // 👈 exportación ESM
