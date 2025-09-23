import Enrollment from "../models/enrollmentsModel.js";
import axios from "axios";

// Crear una nueva inscripción
export const enrollUser = async (req, res) => {
  try {
    const { studentId, instructorId, courseId } = req.body;

    // Validar campos obligatorios
    if (!studentId || !instructorId || !courseId) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    // 🔹 1. Validar que el usuario exista en el microservicio de usuarios
    try {
      await axios.get(`http://localhost:8081/api/validateUser/${studentId}`);
    } catch (error) {
      return res.status(400).json({
        message: "El usuario no existe en el sistema",
        error: error.response?.data || error.message,
      });
    }

    // 🔹 2. Verificar si ya existe inscripción del estudiante en ese curso
    const existingEnrollment = await Enrollment.findOne({
      where: { studentId, courseId },
    });

    if (existingEnrollment) {
      return res.status(409).json({ 
        message: "El estudiante ya está inscrito en este curso" 
      });
    }

    // 🔹 3. Crear inscripción nueva
    const enrollment = await Enrollment.create({
      studentId,
      instructorId,
      courseId,
      enrollmentDateStart: new Date(),
      enrollmentDateEnd: null,
    });

    return res.status(201).json(enrollment);

  } catch (error) {
    console.error("Error al crear la inscripción:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};





// Obtener inscripciones por ID de usuario (studentId)
export const getEnrollmentByUserId = async (req, res) => {
  try {
    const { studentId } = req.query;  // 👈 lo tomas de query

    if (!studentId) {
      return res.status(400).json({ message: "Se requiere el ID del estudiante" });
    }

    const enrollments = await Enrollment.findAll({
      where: { studentId }
    });

    if (!enrollments || enrollments.length === 0) {
      return res.status(404).json({ message: "No se encontraron inscripciones para este usuario" });
    }

    return res.json(enrollments);
  } catch (error) {
    console.error("Error al obtener inscripciones:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};




// Validación de inscripción de un usuario con su ID
export const validateIfUserExist = async (req, res) => {
  try {
    const { userId } = req.params;  // 👈 el ID viene en la URL (ej: /enrollment/validate/5)

    if (!userId) {
      return res.status(400).json({ message: "Se requiere el ID del usuario" });
    }

    // Llamamos al microservicio de usuarios
    const response = await axios.get(`http://localhost:8081/api/validateUser/${userId}`);

    // Si el microservicio responde correctamente, retornamos esa info
    return res.status(200).json({
      message: "Usuario validado correctamente",
      data: response.data
    });

  } catch (error) {
    console.error("Error validando usuario:", error.message);

    if (error.response) {
      // Error devuelto por el microservicio
      return res.status(error.response.status).json({
        message: "Error desde microservicio de usuarios",
        error: error.response.data
      });
    }

    // Error interno (por ejemplo, microservicio caído)
    return res.status(500).json({
      message: "No se pudo validar el usuario",
      error: error.message
    });
  }
};