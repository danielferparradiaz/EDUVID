import { Router } from "express";
import { login, register, forgot, validateUserById } from "../controllers/authController.js";

const router = Router();

router.post("/login", login);
router.post("/register", register);
router.post("/forgot", forgot);
router.get("/validate-user:id" , validateUserById);

export default router;
