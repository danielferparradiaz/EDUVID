import Lesson from "./Lesson.js";

// Crear lección
async function createLesson(data) {
  return await Lesson.create(data);
}

// Listar por curso
async function getLessonsByCourse(courseId) {
  if (!courseId) return await Lesson.findAll();
  return await Lesson.findAll({ where: { courseId } });
}

// Obtener detalle
async function getLessonById(id) {
  return await Lesson.findByPk(id);
}

export {
  createLesson,
  getLessonsByCourse,
  getLessonById
};
