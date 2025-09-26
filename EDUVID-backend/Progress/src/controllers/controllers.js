import progress from "../models/progressModels.js";
import Lesson from "../models/lessonModels.js";
import eurekaClient from "../config/eureka.js";
import axios from "axios";

export const completeLesson = async (req, res) => {
  try {
    console.log("📩 Body recibido:", req.body);

    const { userId, courseId, lessonId } = req.body;

    if (!userId || !courseId || !lessonId) {
      return res.status(400).json({ error: "Faltan parámetros en la petición" });
    }

    // Validar que el usuario exista
    try {
      await validateUserExists(userId);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }

    // Validar que el usuario esté inscrito en el curso
    try {
      await validateUserEnrolled(userId, courseId);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }

    // Validar que el usuario esté inscrito en el curso
    try {
      await validateLessonById(lessonId);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }

    let progressRecord = await progress.findOne({ where: { userId, courseId } });

    if (!progressRecord) {
      progressRecord = await progress.create({
        userId,
        courseId,
        completedLessons: JSON.stringify([lessonId]),
        percentage: 0,
      });
    } else {
      let lessons = Array.isArray(progressRecord.completedLessons)
        ? progressRecord.completedLessons
        : JSON.parse(progressRecord.completedLessons || "[]");

      if (!lessons.includes(lessonId)) {
        lessons.push(lessonId);
      }

      const totalLessons = await Lesson.count({ where: { courseId } });

      let pct = 0;
      if (totalLessons > 0) {
        pct = (lessons.length / totalLessons) * 100;
      }

      progressRecord.completedLessons = JSON.stringify(lessons);
      progressRecord.percentage = pct;
      await progressRecord.save();
    }

    res.json({
      userId: progressRecord.userId,
      courseId: progressRecord.courseId,
      completedLessons: JSON.parse(progressRecord.completedLessons),
      percentage: progressRecord.percentage,
    });

  } catch (err) {
    console.error("❌ Error en completeLesson:", err);
    res.status(500).json({ error: "Error al completar la lección" });
  }
};

export const getprogress = async (req, res) => {
  try {
    const { userId, courseId } = req.query;
    if (!userId || !courseId) {
      return res.status(400).json({ error: "Faltan parámetros userId o courseId" });
    }

    const progress = await progress.findOne({
      where: { userId: Number(userId), courseId: Number(courseId) },
    });

    res.json(progress || { completedLessons: [], percentage: 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener el progreso" });
  }
};

// Validar usuario inscrito en el curso en ENROLLMENT-SERVICE
export const validateUserEnrolled = async (userId, courseId) => {
  try {
    const enrollmentServiceUrl = getServiceUrl("ENROLLMENT-SERVICE");

    const { data } = await axios.get(
      `${enrollmentServiceUrl}/api/validate-enroll/${userId}/${courseId}`
    );

    if (!data.exists) {
      throw new Error("El usuario no está inscrito en ese cursoj");
    }
    return true;
  } catch (error) {
    console.error("❌ Error validando inscripción:", error.message);
    throw new Error("Error validando en ENROLLMENT-SERVICE");
  }
};


// Validarexistencia de usuario en USER-SERVICE
export const validateUserExists = async (userId) => {
  try {
    const userServiceUrl = getServiceUrl("USER-SERVICE");
    // console.log("🛰 URL construida para USER-SERVICE:", userServiceUrl);

    const { data } = await axios.get(`${userServiceUrl}/api/validate-user/${userId}`);

    // console.log("🔍 Respuesta de USER-SERVICE:", data);

    // Ajustado a lo que realmente devuelve USER-SERVICE
    if (data && data.exists && data.user && data.user.id) {
      return true;
    }

    throw new Error("El usuario no existe en el sistema ❌");
  } catch (error) {
    console.error("❌ Error validando usuario:", error.response?.data || error.message);
    throw new Error("Error validando usuario en USER-SERVICE");
  }
};

// Validarexistencia de usuario en USER-SERVICE
export const validateLessonById = async (lessonId) => {
  try {
    const contentServiceUrl = getServiceUrl("CONTENT-SERVICE");

    const { data } = await axios.get(`${contentServiceUrl}/lessons/${lessonId}`);

    if (data && data.lessonId) {
      return true;
    }

    throw new Error("La leccion no existe en el curso ❌");
  } catch (error) {
    console.error("❌ Error validando la lección:", error.response?.data || error.message);
    throw new Error("Error validando la leccion en CONTENT-SERVICE");
  }
};



// 🔎 Helper para obtener la URL de un microservicio desde Eureka
function getServiceUrl(appName) {
  const instances = eurekaClient.getInstancesByAppId(appName);
  if (!instances || instances.length === 0) {
    throw new Error(`❌ No hay instancias para ${appName}`);
  }
  const instance = instances[0];
  return `http://${instance.hostName}:${instance.port.$}`;
}

