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



// ✅ Crear usuario
export const createUser = async (req, res) => {
  try {
    const { email, password, rol, name } = req.body;

    if (!email || !password || !rol) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    const userExist = await User.findOne({ where: { email } });
    if (userExist) {
      return res.status(409).json({ message: "El email ya está registrado" });
    }

    const newUser = await User.create({ email, password, rol, name });
    return res.status(201).json({
      message: "Usuario creado correctamente",
      user: { id: newUser.id, email: newUser.email, rol: newUser.rol }
    });
  } catch (error) {
    console.error("❌ [createUser] Error:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

// ✅ Obtener perfil
export const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({ message: "El id debe ser un número válido" });
    }

    const user = await User.findByPk(id, {
      attributes: ["id", "email", "rol", "name"]
    });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    return res.json(user);
  } catch (error) {
    console.error("❌ [getUserProfile] Error:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

// ✅ Actualizar usuario
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, name, rol } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({ message: "El id debe ser un número válido" });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    await user.update({ email, name, rol });
    return res.json({
      message: "Usuario actualizado correctamente",
      user: { id: user.id, email: user.email, rol: user.rol, name: user.name }
    });
  } catch (error) {
    console.error("❌ [updateUser] Error:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

// ✅ Listar profesores
export const listTeachers = async (req, res) => {
  try {
    const { role } = req.query;

    let where = {};
    if (role) {
      where.rol = role;
    }

    const users = await User.findAll({
      where,
      attributes: ["id", "email", "rol", "name"]
    });

    return res.json(users);
  } catch (error) {
    console.error("❌ [listTeachers] Error:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};
