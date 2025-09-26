const db = require("./db");

// Crear lección
function createLesson(data) {
  const newLesson = {
    id: db.lessons.length + 1,
    courseId: data.courseId,
    title: data.title,
    description: data.description || "",
    order: data.order || db.lessons.length + 1,
    resourceUrl: data.resourceUrl || ""
  };
  db.lessons.push(newLesson);
  return newLesson;
}

// Listar por curso
function getLessonsByCourse(courseId) {
  if (!courseId) return db.lessons;
  return db.lessons.filter(l => l.courseId == courseId);
}

// Obtener detalle
function getLessonById(id) {
  return db.lessons.find(l => l.id === id);
}

module.exports = {
  createLesson,
  getLessonsByCourse,
  getLessonById
};
