import { Router } from "express";
import { 
  createUser, 
  getUserProfile, 
  updateUser, 
  listTeachers, 
  validateUserById ,
  listStudentsByTeacher
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

router.get("/students-by-teacher/:teacherId", listStudentsByTeacher);

export default router;
