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

    // Validaciones
    await validateUserExists(userId);
    await validateUserEnrolled(userId, courseId);
    await validateLessonById(lessonId);

    let progressRecord = await progress.findOne({ where: { userId, courseId } });

    if (!progressRecord) {
      const totalLessons = await Lesson.count({ where: { courseId } });

      let pct = 0;
      if (totalLessons > 0) {
        pct = (1 / totalLessons) * 100;  // ya completó la primera lección
      }

      progressRecord = await progress.create({
        userId,
        courseId,
        completedLessons: JSON.stringify([lessonId]),
        percentage: pct,
      });
    }

    else {
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

      // 🏆 Si terminó el curso => llamar a CERTIFICATES-SERVICE
      if (pct === 100) {
        try {
          const certServiceUrl = getServiceUrl("CERTIFICATES-SERVICE");
          const { data } = await axios.post(`${certServiceUrl}/certificates/generate`, {
            userId,
            courseId,
          });
          console.log("✅ Certificado generado:", data);
        } catch (err) {
          console.error("❌ Error creando certificado:", err.message);
          // opcional: no romper flujo de respuesta al cliente
        }
      }
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

export const getProgress = async (req, res) => {
  try {
    const { studentId, courseId } = req.params;
    if (!studentId || !courseId) {
      return res.status(400).json({ error: "Faltan parámetros studentId o courseId" });
    }

    const prog = await progress.findOne({
      where: { userId: Number(studentId), courseId: Number(courseId) },
    });

    res.json(prog || { completedLessons: [], percentage: 0 });
  } catch (err) {
    console.error("❌ Error en getProgress:", err);
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

// Validarexistencia de usuario en USER-SERVICE
export const validatePercent = async (percentage) => {
  try {
    const contentServiceUrl = getServiceUrl("CONTENT-SERVICE");

    const { data } = await axios.get(`${contentServiceUrl}/lessons/${percentage}`);

    if (data && data.lessonId) {
      return true;
    }

    throw new Error("La leccion no existe en el curso ❌");
  } catch (error) {
    console.error("❌ Error validando la lección:", error.response?.data || error.message);
    throw new Error("Error validando la leccion en CONTENT-SERVICE");
  }
};



export const listProgressByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    if (!studentId) {
      return res.status(400).json({ error: "Falta parámetro studentId" });
    }

    const records = await progress.findAll({ where: { userId: Number(studentId) } });

    res.json(records || []);
  } catch (err) {
    console.error("❌ Error en listProgressByStudent:", err);
    res.status(500).json({ error: "Error al obtener los progresos" });
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




