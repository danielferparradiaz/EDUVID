import Progress from "../models/progressModels.js";
import Lesson from "../models/lessonModels.js"; // Solo si tienes un modelo de lecciones

export const completeLesson = async (req, res) => {
  const { UserId, courseId, lessonId } = req.body;

  // Buscar progreso existente
  let progress = await Progress.findOne({ where: { UserId, courseId } });
  if (!progress) {
    progress = await Progress.create({
      UserId,
      courseId,
      completedLessons: [lessonId],
      percentage: 0
    });
  } else {
    // Evitar duplicados
    if (!progress.completedLessons.includes(lessonId)) {
      progress.completedLessons.push(lessonId);
    }
  }

  // Calcular porcentaje usando total de lecciones
  const totalLessons = await Lesson.count({ where: { courseId } }); // Ajusta según tu modelo
  const pct = (progress.completedLessons.length / totalLessons) * 100;

  progress.percentage = pct;
  await progress.save();

  res.json(progress);
};

export const getProgress = async (req, res) => {
  try {
    const { UserId, courseId } = req.query; // <-- en minúscula
    if (!UserId || !courseId) {
      return res.status(400).json({ error: "Faltan parámetros UserId o courseId" });
    }

    const progress = await Progress.findOne({
      where: { UserId: Number(UserId), courseId: Number(courseId) }
    });

    res.json(progress || { completedLessons: [], percentage: 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener el progreso" });
  }
};

