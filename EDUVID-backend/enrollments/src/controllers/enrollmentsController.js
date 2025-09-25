import axios from "axios";
import Enrollment from "../models/enrollmentsModel.js";
import eurekaClient from "../config/eureka.js"; 


// Crear una nueva inscripción
export const enrollUser = async (req, res) => {
  try {
    const { studentId, instructorId, courseId } = req.body;

    // 1. Validar campos obligatorios
    if (!studentId || !instructorId || !courseId) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    // 2. Validar existencia en microservicios
    try {
      await validateUserExists(studentId);
      await validateCourseExists(courseId);
    } catch (validationError) {
      return res.status(400).json({ message: validationError.message });
    }

    // 3. Verificar si ya existe inscripción
    const existingEnrollment = await Enrollment.findOne({ where: { studentId, courseId } });
    if (existingEnrollment) {
      return res.status(409).json({ message: "El estudiante ya está inscrito en este curso" });
    }

    // 4. Crear inscripción nueva
    const enrollment = await Enrollment.create({
      studentId,
      instructorId,
      courseId,
      enrollmentDateStart: new Date(),
      enrollmentDateEnd: null,
    });

    return res.status(201).json(enrollment);

  } catch (error) {
    console.error("❌ Error al crear la inscripción:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

// 🔎 Función auxiliar: obtener URL de un servicio
function getServiceUrl(appName) {
  const instances = eurekaClient.getInstancesByAppId(appName);
  if (!instances || instances.length === 0) {
    throw new Error(`❌ No hay instancias para ${appName}`);
  }
  // Tomar la primera instancia (luego puedes hacer round-robin para balanceo)
  const instance = instances[0];
  return `http://${instance.hostName}:${instance.port.$}`;
}

// Validar usuario en USER-SERVICE
export const validateUserExists = async (userId) => {
  try {
    const userServiceUrl = getServiceUrl("USER-SERVICE");
    const { data } = await axios.get(`${userServiceUrl}/api/validate-user/${userId}`);

    if (data.exists) {
      return true;
    }
    throw new Error("El usuario no existe en el sistema");
  } catch (error) {
    console.error(error.message);
    throw new Error("Error validando usuario en USER-SERVICE");
  }
};

// Valida existencia de curso en microservicio de cursos
export const validateCourseExists = async (userId) => {
  try {
    const userServiceUrl = getServiceUrl("COURSES-SERVICE");
    const { data } = await axios.get(`${userServiceUrl}/api/validate-course/${userId}`);

    if (data.exists) {
      return true;
    }
    throw new Error("El curso no existe en el sistema");
  } catch (error) {
    console.error(error.message);
    throw new Error("Error validando usuario en COURSES-SERVICE");
  }
};


// Validar si un usuario está inscrito en un curso específico
export const validateEnrollment = async (req, res) => {
  try {
    const { userId, courseId } = req.params; // vienen en la URL

    if (!userId || !courseId) {
      return res.status(400).json({ exists: false, message: "Faltan parámetros userId o courseId" });
    }

    const enrollment = await Enrollment.findOne({
      where: { studentId: userId, courseId }
    });

    if (enrollment) {
      return res.json({ exists: true });
    }

    return res.json({ exists: false, message: "El usuario no está inscrito en este curso" });
  } catch (error) {
    console.error("❌ Error validando inscripción:", error);
    return res.status(500).json({ exists: false, message: "Error interno del servidor" });
  }
};
