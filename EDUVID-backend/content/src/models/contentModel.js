import Lesson from "./Lesson.js";

async function createLesson(data) {
  return await Lesson.create(data);
}

async function getLessonsByCourse(courseId) {
  if (!courseId) return await Lesson.findAll();
  return await Lesson.findAll({ where: { courseId } });
}

async function getLessonById(id) {
  return await Lesson.findByPk(id);
}

async function updateLesson(id, data) {
  const lesson = await Lesson.findByPk(id);
  if (!lesson) return null;
  await lesson.update(data);
  return lesson;
}

async function deleteLesson(id) {
  const lesson = await Lesson.findByPk(id);
  if (!lesson) return null;
  await lesson.destroy();
  return lesson;
}

// 👇 aquí agrupamos todas las funciones
export const contentModel = {
  createLesson,
  getLessonsByCourse,
  getLessonById,
  updateLesson,
  deleteLesson
};
