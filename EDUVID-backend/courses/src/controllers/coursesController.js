import Course from "../models/coursesModel.js";

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
      updatedAt: new Date()
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

