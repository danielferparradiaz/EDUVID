import User from "../models/User.js";

export const validateUserById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("🔎 [validateUserById] ID recibido:", id);

    // Validar que id sea un número válido
    if (isNaN(id)) {
      console.warn("⚠️ [validateUserById] ID inválido:", id);
      return res.status(400).json({ message: "El id debe ser un número válido" });
    }

    // Buscar el usuario en la BD
    console.log("📡 [validateUserById] Buscando usuario en DB...");
    const user = await User.findByPk(id, {
      attributes: ["id", "email", "rol"] // 👈 no devolvemos la contraseña
    });
    console.log("📥 [validateUserById] Resultado DB:", user);

    if (!user) {
      console.warn("❌ [validateUserById] Usuario no encontrado");
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    console.log("✅ [validateUserById] Usuario encontrado:", user.toJSON());
    return res.json({ exists: true, user });
  } catch (error) {
    console.error("❌ [validateUserById] Error en controlador:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};
