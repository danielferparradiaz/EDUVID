import Course from "../models/coursesModel.js";
import eurekaClient from "../config/eureka.js"; 
import axios from "axios";


/**
 * Crear un nuevo curso
 */
export const crearCurso = async (req, res) => {
  try {
    const { instructorId, nombre, descripcion, videoUrl, category } = req.body;
    console.log("📥 [crearCurso] Datos recibidos:", { instructorId, nombre, descripcion, videoUrl, category });

    if (!instructorId || !nombre || !descripcion || !videoUrl || !category) {
      console.warn("⚠️ [crearCurso] Faltan campos obligatorios");
      const response = { error: "Todos los campos son obligatorios" };
      console.log("⬅️ [crearCurso] Respuesta:", response);
      return res.status(400).json(response);
    }

    console.log("📝 [crearCurso] Creando nuevo curso en DB...");
    const nuevoCurso = await Course.create({
      instructorId,
      nombre,
      descripcion,
      videoUrl,
      category,
      createdAt: new Date(),
      updatedAt: null
    });

    const response = { message: "Curso creado correctamente", curso: nuevoCurso };
    console.log("✅ [crearCurso] Curso creado:", nuevoCurso.toJSON());
    console.log("⬅️ [crearCurso] Respuesta:", response);
    return res.status(201).json(response);

  } catch (error) {
    console.error("❌ [crearCurso] Error:", error);
    return res.status(500).json({ error: "Error en el servidor" });
  }
};

/**
 * Listar todos los cursos
 */
export const listar = async (req, res) => {
  try {
    console.log("📥 [listar] Request recibido");
    const cursos = await Course.findAll();
    console.log(`✅ [listar] Cursos encontrados: ${cursos.length}`);
    return res.json(cursos);
  } catch (error) {
    console.error("❌ [listar] Error:", error);
    return res.status(500).json({ error: "Error en el servidor" });
  }
};

/**
 * Obtener información de un curso por ID
 */
export const infoCurso = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("📥 [infoCurso] Params recibidos:", { id });

    const curso = await Course.findByPk(id);

    if (!curso) {
      console.warn("⚠️ [infoCurso] Curso no encontrado:", id);
      return res.status(404).json({ error: "Curso no encontrado" });
    }

    console.log("✅ [infoCurso] Curso encontrado:", curso.toJSON());
    return res.json(curso);

  } catch (error) {
    console.error("❌ [infoCurso] Error:", error);
    return res.status(500).json({ error: "Error en el servidor" });
  }
};


/**
 * Actualizar un curso
 */
export const actualizarCurso = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, videoUrl, category } = req.body;
    console.log("📥 [actualizarCurso] Params:", { id }, "Body:", { nombre, descripcion, videoUrl, category });

    const curso = await Course.findByPk(id);

    if (!curso) {
      console.warn("⚠️ [actualizarCurso] Curso no encontrado:", id);
      return res.status(404).json({ error: "Curso no encontrado" });
    }

    console.log("🛠️ [actualizarCurso] Actualizando curso...");
    await curso.update({
      nombre: nombre ?? curso.nombre,
      descripcion: descripcion ?? curso.descripcion,
      videoUrl: videoUrl ?? curso.videoUrl,
      category: category ?? curso.category,
      updatedAt: new Date()
    });

    const response = { message: "Curso actualizado correctamente", curso };
    console.log("✅ [actualizarCurso] Curso actualizado:", curso.toJSON());
    console.log("⬅️ [actualizarCurso] Respuesta:", response);
    return res.json(response);

  } catch (error) {
    console.error("❌ [actualizarCurso] Error:", error);
    return res.status(500).json({ error: "Error en el servidor" });
  }
};


/**
 * Eliminar un curso
 */
export const eliminarCurso = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("📥 [eliminarCurso] Params recibidos:", { id });

    const curso = await Course.findByPk(id);

    if (!curso) {
      console.warn("⚠️ [eliminarCurso] Curso no encontrado:", id);
      return res.status(404).json({ error: "Curso no encontrado" });
    }

    console.log("🗑️ [eliminarCurso] Eliminando curso...");
    await curso.destroy();

    const response = { message: "Curso eliminado correctamente" };
    console.log("✅ [eliminarCurso] Curso eliminado:", id);
    console.log("⬅️ [eliminarCurso] Respuesta:", response);
    return res.json(response);

  } catch (error) {
    console.error("❌ [eliminarCurso] Error:", error);
    return res.status(500).json({ error: "Error en el servidor" });
  }
};


/**
 * Validar existencia de curso por ID
 */
export const validateIfCourseExistById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("📥 [validateIfCourseExistById] Params recibidos:", { id });

    const curso = await Course.findByPk(id);

    if (!curso) {
      console.warn("⚠️ [validateIfCourseExistById] Curso no encontrado:", id);
      return res.status(404).json({ exists: false, message: "Curso no encontrado" });
    }

    const response = { exists: true, curso };
    console.log("✅ [validateIfCourseExistById] Curso encontrado:", curso.toJSON());
    console.log("⬅️ [validateIfCourseExistById] Respuesta:", response);
    return res.json(response);

  } catch (error) {
    console.error("❌ [validateIfCourseExistById] Error:", error);
    return res.status(500).json({ exists: false, message: "Error en el servidor" });
  }
};


/**
 * Listar cursos por profesor (instructorId)
 */
export const listarByprofesorId = async (req, res) => {
  try {
    const { id } = req.params; // id del profesor
    console.log("📥 [listarByprofesorId] Params recibidos:", { id });

    const cursos = await Course.findAll({
      where: { instructorId: id },
      order: [["createdAt", "DESC"]],
    });

    if (!cursos || cursos.length === 0) {
      console.warn("⚠️ [listarByprofesorId] No se encontraron cursos para el profesor:", id);
      return res.status(404).json({ error: "No se encontraron cursos para este profesor" });
    }

    console.log(`✅ [listarByprofesorId] Cursos encontrados: ${cursos.length}`);
    return res.json(cursos);

  } catch (error) {
    console.error("❌ [listarByprofesorId] Error:", error);
    return res.status(500).json({ error: "Error en el servidor" });
  }
};

/**
 * recomendacion de curso para estudiante (incluye lecciones)
 */
export const recomendationForStudent = async (req, res) => {
  try {
    const cursos = await Course.findAll();

    if (!cursos || cursos.length === 0) {
      return res.status(404).json({ error: "No hay cursos disponibles" });
    }

    const cursosConLecciones = [];
    for (const curso of cursos) {
      const lecciones = await getLessonsByCourseId(curso.id);
      if (lecciones && lecciones.length > 0) {
        cursosConLecciones.push({
          ...curso.toJSON(),
          lessons: lecciones,
        });
      }
    }

    if (cursosConLecciones.length === 0) {
      return res.status(404).json({ error: "No hay cursos con lecciones disponibles" });
    }

    const randomIndex = Math.floor(Math.random() * cursosConLecciones.length);
    const recomendacion = cursosConLecciones[randomIndex];

    return res.json(recomendacion);

  } catch (error) {
    console.error("❌ [recomendationForStudent] Error:", error);
    return res.status(500).json({ error: "Error en el servidor" });
  }
};


// Traer las lecciones del curso
export const getLessonsByCourseId = async (courseId) => {
  try {
    const contentServiceUrl = getServiceUrl("CONTENT-SERVICE");
    console.log(`📡 [getLessonByCourse] Consultando: ${contentServiceUrl}/lessons?courseId=${courseId}`);

    const { data } = await axios.get(`${contentServiceUrl}/lessons?courseId=${courseId}`);
    console.log("📥 [getLessonByCourse] Respuesta:", data);

    if (Array.isArray(data) && data.length > 0) {
      console.log("✅ [getLessonByCourse] Lecciones encontradas");
      return data;
    }
    return [];
  } catch (error) {
    console.error("❌ [getLessonByCourse] Error:", error.message);
    return [];
  }
};

/**
 * Listar cursos por estudiante (studentId)
 */
export const listarByEstudianteId = async (req, res) => {
  try {
    const { id } = req.params; // id del estudiante
    console.log("📥 [listarByEstudianteId] Params recibidos:", { id });

    // 1. Buscar inscripciones del estudiante
    const enrollmentServiceUrl = getServiceUrl("CONTENT-SERVICE"); // o si manejas el enrollment aquí mismo
    console.log(`📡 [listarByEstudianteId] Consultando enrollment para estudiante: ${id}`);

    // Si enrollment está en esta misma BD:
    const [results] = await Course.sequelize.query(
      `SELECT c.* 
       FROM enrollment e
       INNER JOIN courses c ON e.courseId = c.id
       WHERE e.studentId = :studentId`,
      {
        replacements: { studentId: id },
        type: Course.sequelize.QueryTypes.SELECT
      }
    );

    if (!results || results.length === 0) {
      console.warn("⚠️ [listarByEstudianteId] No se encontraron cursos para el estudiante:", id);
      return res.status(404).json({ error: "No se encontraron cursos para este estudiante" });
    }

    console.log(`✅ [listarByEstudianteId] Cursos encontrados: ${results.length}`);
    return res.json(results);

  } catch (error) {
    console.error("❌ [listarByEstudianteId] Error:", error);
    return res.status(500).json({ error: "Error en el servidor" });
  }
};



// 🔎 Función auxiliar: obtener URL de un servicio
function getServiceUrl(appName) {
  console.log(`🌍 [getServiceUrl] Buscando instancias para: ${appName}`);
  const instances = eurekaClient.getInstancesByAppId(appName);
  console.log(`[getServiceUrl] Instancias encontradas:`, instances);

  if (!instances || instances.length === 0) {
    throw new Error(`❌ No hay instancias para ${appName}`);
  }

  const instance = instances[0];
  const url = `http://${instance.hostName}:${instance.port.$}`;
  console.log(`✅ [getServiceUrl] URL construida para ${appName}: ${url}`);
  return url;
}




