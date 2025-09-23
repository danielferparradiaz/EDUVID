import User from "../models/User.js";

export const validateUserById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validar que id sea un número válido
    if (isNaN(id)) {
      return res.status(400).json({ message: "El id debe ser un número válido" });
    }

    // Buscar el usuario en la BD
    const user = await User.findByPk(id, {
      attributes: ["id", "email", "rol"] // 👈 no devolvemos la contraseña
    });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    return res.json({ exists: true, user });
  } catch (error) {
    console.error("Error en validateUserById:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
}; 