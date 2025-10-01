const contentModel = require("../models/contentModel");

// Crear lección
exports.createLesson = async (req, res) => {
  try {
    console.log("📥 [createLesson] Request body recibido:", req.body);

    const newLesson = req.body;
    const lesson = await contentModel.createLesson(newLesson);

    console.log("✅ [createLesson] Lección creada:", lesson);
    res.status(201).json(lesson);
  } catch (error) {
    console.error("❌ [createLesson] Error al crear lección:", error);
    res.status(500).json({ message: "Error al crear la lección" });
  }
};

// Listar lecciones por curso
exports.getLessonsByCourse = async (req, res) => {
  try {
    const { courseId } = req.query;
    console.log("📥 [getLessonsByCourse] Query params recibidos:", req.query);

    const lessons = await contentModel.getLessonsByCourse(courseId);

    console.log(`✅ [getLessonsByCourse] Lecciones encontradas para curso ${courseId}:`, lessons);
    res.json(lessons);
  } catch (error) {
    console.error("❌ [getLessonsByCourse] Error al obtener lecciones:", error);
    res.status(500).json({ message: "Error al obtener lecciones" });
  }
};

// Obtener detalle de una lección
exports.getLessonById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("📥 [getLessonById] Params recibidos:", req.params);

    const lesson = await contentModel.getLessonById(parseInt(id));

    if (!lesson) {
      console.warn(`⚠️ [getLessonById] Lección con ID ${id} no encontrada`);
      return res.status(404).json({ message: "Lesson not found" });
    }

    console.log("✅ [getLessonById] Lección encontrada:", lesson);
    res.json(lesson);
  } catch (error) {
    console.error("❌ [getLessonById] Error al obtener lección:", error);
    res.status(500).json({ message: "Error al obtener la lección" });
  }
};


// Editar lección
exports.updateLesson = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("📥 [updateLesson] Params recibidos:", req.params);
    console.log("📥 [updateLesson] Body recibido:", req.body);

    const updated = await contentModel.updateLesson(parseInt(id), req.body);

    if (!updated) {
      console.warn(`⚠️ [updateLesson] Lección con ID ${id} no encontrada`);
      return res.status(404).json({ message: "Lesson not found" });
    }

    console.log("✅ [updateLesson] Lección actualizada:", updated);
    res.json(updated);
  } catch (error) {
    console.error("❌ [updateLesson] Error al actualizar lección:", error);
    res.status(500).json({ message: "Error al actualizar la lección" });
  }
};

// Eliminar lección
exports.deleteLesson = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("📥 [deleteLesson] Params recibidos:", req.params);

    const deleted = await contentModel.deleteLesson(parseInt(id));

    if (!deleted) {
      console.warn(`⚠️ [deleteLesson] Lección con ID ${id} no encontrada`);
      return res.status(404).json({ message: "Lesson not found" });
    }

    console.log("✅ [deleteLesson] Lección eliminada:", deleted);
    res.json({ message: "Lesson deleted" });
  } catch (error) {
    console.error("❌ [deleteLesson] Error al eliminar lección:", error);
    res.status(500).json({ message: "Error al eliminar la lección" });
  }
};

