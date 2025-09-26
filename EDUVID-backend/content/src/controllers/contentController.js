const contentModel = require("../models/contentModel");

// Crear lección
exports.createLesson = (req, res) => {
  const newLesson = req.body;
  const lesson = contentModel.createLesson(newLesson);
  res.status(201).json(lesson);
};

// Listar lecciones por curso
exports.getLessonsByCourse = (req, res) => {
  const { courseId } = req.query;
  const lessons = contentModel.getLessonsByCourse(courseId);
  res.json(lessons);
};

// Obtener detalle de una lección
exports.getLessonById = (req, res) => {
  const { id } = req.params;
  const lesson = contentModel.getLessonById(parseInt(id));
  if (!lesson) {
    return res.status(404).json({ message: "Lesson not found" });
  }
  res.json(lesson);
};
