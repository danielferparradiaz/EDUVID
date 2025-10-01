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

// Actualizar lección
async function updateLesson(id, data) {
  const lesson = await Lesson.findByPk(id);
  if (!lesson) return null;

  await lesson.update(data);
  return lesson;
}

// Eliminar lección
async function deleteLesson(id) {
  const lesson = await Lesson.findByPk(id);
  if (!lesson) return null;

  await lesson.destroy();
  return lesson;
}

export {
  createLesson,
  getLessonsByCourse,
  getLessonById,
  updateLesson,  
  deleteLesson    
};

