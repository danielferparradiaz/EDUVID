import axios from "axios";
import Enrollment from "../models/enrollmentsModel.js";
import eurekaClient from "../config/eureka.js"; 

// Crear una nueva inscripción
export const enrollUser = async (req, res) => {
  try {
    const { studentId, instructorId, courseId } = req.body;
    console.log("📥 [enrollUser] Datos recibidos:", { studentId, instructorId, courseId });

    // 1. Validar campos obligatorios
    if (!studentId || !instructorId || !courseId) {
      console.warn("⚠️ [enrollUser] Faltan campos obligatorios");
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    // 2. Validar existencia en microservicios
    try {
      console.log("🔎 [enrollUser] Validando usuario e curso en microservicios...");
      await validateUserExists(studentId);
      await validateCourseExists(courseId);
    } catch (validationError) {
      console.error("❌ [enrollUser] Error en validación de microservicios:", validationError.message);
      return res.status(400).json({ message: validationError.message });
    }

    // 3. Verificar si ya existe inscripción
    console.log("🔍 [enrollUser] Buscando inscripción existente...");
    const existingEnrollment = await Enrollment.findOne({ where: { studentId, courseId } });
    if (existingEnrollment) {
      console.warn("⚠️ [enrollUser] Inscripción duplicada detectada");
      return res.status(409).json({ message: "El estudiante ya está inscrito en este curso" });
    }

    // 4. Crear inscripción nueva
    console.log("📝 [enrollUser] Creando inscripción nueva...");
    const enrollment = await Enrollment.create({
      studentId,
      instructorId,
      courseId,
      enrollmentDateStart: new Date(),
      enrollmentDateEnd: null,
    });

    console.log("✅ [enrollUser] Inscripción creada:", enrollment.toJSON());
    return res.status(201).json(enrollment);

  } catch (error) {
    console.error("❌ [enrollUser] Error al crear la inscripción:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

// 🔎 Función auxiliar: obtener URL de un servicio
function getServiceUrl(appName) {
  console.log(`🌍 [getServiceUrl] Buscando instancias para: ${appName}`);
  const instances = eurekaClient.getInstancesByAppId(appName);
  console.log(`[getServiceUrl] Instancias encontradas:`, instances);

  if (!instances || instances.length === 0) {
    throw new Error(`❌ No hay instancias para ${appName}`);
  }

  const instance = instances[0];
  const url = `http://${instance.hostName}:${instance.port.$}`;
  console.log(`✅ [getServiceUrl] URL construida para ${appName}: ${url}`);
  return url;
}

// Validar usuario en USER-SERVICE
export const validateUserExists = async (userId) => {
  try {
    const userServiceUrl = getServiceUrl("USER-SERVICE");
    console.log(`📡 [validateUserExists] Consultando: ${userServiceUrl}/api/validate-user/${userId}`);

    const { data } = await axios.get(`${userServiceUrl}/api/validate-user/${userId}`);
    console.log("📥 [validateUserExists] Respuesta:", data);

    if (data.exists) {
      console.log("✅ [validateUserExists] Usuario válido");
      return data.user; // devolver datos si los necesitas
    }
    throw new Error("El usuario no existe en el sistema");
  } catch (error) {
    console.error("❌ [validateUserExists] Error:", error.message);
    throw new Error("Error validando usuario en USER-SERVICE");
  }
};

// Validar curso en COURSES-SERVICE
export const validateCourseExists = async (courseId) => {
  try {
    const courseServiceUrl = getServiceUrl("COURSES-SERVICE");
    console.log(`📡 [validateCourseExists] Consultando: ${courseServiceUrl}/api/validate-course/${courseId}`);

    const { data } = await axios.get(`${courseServiceUrl}/api/validate-course/${courseId}`);
    console.log("📥 [validateCourseExists] Respuesta:", data);

    if (data.exists) {
      console.log("✅ [validateCourseExists] Curso válido");
      return data.curso; // devolver datos si los necesitas
    }
    throw new Error("El curso no existe en el sistema");
  } catch (error) {
    console.error("❌ [validateCourseExists] Error:", error.message);
    throw new Error("Error validando curso en COURSES-SERVICE");
  }
};


// Validar si un usuario está inscrito en un curso específico
export const validateEnrollment = async (req, res) => {
  try {
    const { userId, courseId } = req.params; 
    console.log("📥 [validateEnrollment] Params recibidos:", { userId, courseId });

    if (!userId || !courseId) {
      console.warn("⚠️ [validateEnrollment] Faltan parámetros");
      return res.status(400).json({ exists: false, message: "Faltan parámetros userId o courseId" });
    }

    console.log("🔍 [validateEnrollment] Buscando inscripción...");
    const enrollment = await Enrollment.findOne({
      where: { studentId: userId, courseId }
    });

    if (enrollment) {
      console.log("✅ [validateEnrollment] Inscripción encontrada");
      return res.json({ exists: true });
    }

    console.log("❌ [validateEnrollment] No se encontró inscripción");
    return res.json({ exists: false, message: "El usuario no está inscrito en este curso" });
  } catch (error) {
    console.error("❌ [validateEnrollment] Error:", error);
    return res.status(500).json({ exists: false, message: "Error interno del servidor" });
  }
};
