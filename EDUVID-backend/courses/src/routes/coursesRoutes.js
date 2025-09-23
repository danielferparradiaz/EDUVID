import { Router } from "express";
import { crearCurso, listar, infoCurso, actualizarCurso, eliminarCurso, validateIfCourseExistById } from "../controllers/coursesController.js";

const router = Router();

router.post("/crear-curso", crearCurso);
router.get("/listar", listar);
router.get("/info-curso/:id", infoCurso);  // <- le paso el id por params
router.put("/actualizar-curso/:id", actualizarCurso);
router.delete("/eliminar-curso/:id", eliminarCurso); // <- agrego delete
router.get("/validate-course/:id", validateIfCourseExistById); // <- agrego delete

export default router;

