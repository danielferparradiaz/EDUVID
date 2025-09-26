import { Router } from "express";
import { 
  createUser, 
  getUserProfile, 
  updateUser, 
  listTeachers, 
  validateUserById 
} from "../controllers/userController.js";

const router = Router();
router.use((req, res, next) => {
  console.log(`📡 [UserService] ${req.method} ${req.originalUrl}`);
  next();
});

// Crear usuario
router.post("/users", createUser);

// Obtener perfil por ID
router.get("/users/:id", getUserProfile);

// Actualizar usuario
router.put("/users/:id", updateUser);

// Listar profesores
router.get("/users", listTeachers);

// Validar usuario (ya lo tenías)
router.get("/validate-user/:id", validateUserById);

export default router;
