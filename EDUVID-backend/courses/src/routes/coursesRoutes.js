import { Router } from "express";
import { crearCurso, listar, infoCurso, actualizarCurso, eliminarCurso, 
  validateIfCourseExistById, listarByprofesorId,
  recomendationForStudent
} from "../controllers/coursesController.js";

const router = Router();

// Middleware global de logging para rutas de cursos
router.use((req, res, next) => {
  console.log(`➡️ [CoursesRouter] ${req.method} ${req.originalUrl}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log("📦 [CoursesRouter] Body:", req.body);
  }
  next();
});

router.post("/crear-curso", crearCurso);
router.get("/listar", listar);
router.get("/listarByTeacherId/:id", listarByprofesorId);
router.get("/info-curso/:id", infoCurso);
router.put("/actualizar-curso/:id", actualizarCurso);
router.delete("/eliminar-curso/:id", eliminarCurso);
router.get("/validate-course/:id", validateIfCourseExistById);
router.get("/recomendacion", recomendationForStudent);

export default router;
