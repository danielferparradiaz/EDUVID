import { Router } from "express";
import { validateUserById } from "../controllers/userController.js";

const router = Router();

router.get("/validate-user/:id", (req, res, next) => {
  console.log("📥 [UserService] Request recibido en /validate-user/:id", req.params);
  next();
}, validateUserById);

export default router;
