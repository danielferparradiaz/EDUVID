import Course from "../models/coursesModel.js";

/**
 * Crear un nuevo curso
 */
export const crearCurso = async (req, res) => {
  try {
    const { instructorId, nombre, descripcion, videoUrl, category } = req.body;

    if (!instructorId || !nombre || !descripcion || !videoUrl || !category) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    const nuevoCurso = await Course.create({
      instructorId,
      nombre,
      descripcion,
      videoUrl,
      category,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return res.status(201).json({
      message: "Curso creado correctamente",
      curso: nuevoCurso
    });

  } catch (error) {
    console.error("Error al crear curso:", error);
    return res.status(500).json({ error: "Error en el servidor" });
  }
};

/**
 * Listar todos los cursos
 */
export const listar = async (req, res) => {
  try {
    const cursos = await Course.findAll();
    return res.json(cursos);
  } catch (error) {
    console.error("Error al listar cursos:", error);
    return res.status(500).json({ error: "Error en el servidor" });
  }
};

/**
 * Obtener información de un curso por ID
 */
export const infoCurso = async (req, res) => {
  try {
    const { id } = req.params;

    const curso = await Course.findByPk(id);

    if (!curso) {
      return res.status(404).json({ error: "Curso no encontrado" });
    }

    return res.json(curso);

  } catch (error) {
    console.error("Error al obtener información del curso:", error);
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

    const curso = await Course.findByPk(id);

    if (!curso) {
      return res.status(404).json({ error: "Curso no encontrado" });
    }

    await curso.update({
      nombre: nombre ?? curso.nombre,
      descripcion: descripcion ?? curso.descripcion,
      videoUrl: videoUrl ?? curso.videoUrl,
      category: category ?? curso.category,
      updatedAt: new Date()
    });

    return res.json({
      message: "Curso actualizado correctamente",
      curso
    });

  } catch (error) {
    console.error("Error al actualizar curso:", error);
    return res.status(500).json({ error: "Error en el servidor" });
  }
};

/**
 * Eliminar un curso
 */
export const eliminarCurso = async (req, res) => {
  try {
    const { id } = req.params;

    const curso = await Course.findByPk(id);

    if (!curso) {
      return res.status(404).json({ error: "Curso no encontrado" });
    }

    await curso.destroy();

    return res.json({ message: "Curso eliminado correctamente" });

  } catch (error) {
    console.error("Error al eliminar curso:", error);
    return res.status(500).json({ error: "Error en el servidor" });
  }
};


export const validateIfCourseExistById = async (req, res) => {
  try {
    const { id } = req.params;

    const curso = await Course.findByPk(id);

    if (!curso) {
      return res.status(404).json({ error: "Curso no encontrado" });
    }

    return res.json({ message: true });

  } catch (error) {
    console.error("El curso no existe, revisa la información:", error);
    return res.status(500).json({ error: "Error en el servidor" });
  }
};
