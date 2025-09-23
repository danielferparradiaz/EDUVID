import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import User from "../models/userModel.js";
import nodemailer from "nodemailer";


const privateKey = fs.readFileSync(path.resolve("private.pem"), "utf8");

export const login = async (req, res) => {
  console.log("Login recibido:", req.body);
  const { email, password, rol } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: "Usuario no encontrado" });

    if (rol && user.rol.toLowerCase() !== rol.toLowerCase()) {
      return res.status(401).json({ error: "Rol incorrecto" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ error: "Contraseña incorrecta" });

    const token = jwt.sign(
      { id: user.id, email: user.email, rol: user.rol },
      privateKey,
      { algorithm: "RS256", expiresIn: "1h" }
    );

    res.json({ token, rol: user.rol });
  } catch (err) {
    console.error("❌ Error login:", err);
    res.status(500).json({ error: "Error en servidor" });
  }
};


export const register = async (req, res) => {
  try {
    const { email, password, rol } = req.body;

    // Validar que no falten campos
    if (!email || !password || !rol) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    // Verificar si ya existe el usuario
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const newUser = await User.create({
      email,
      password: hashedPassword,
      rol
    });

    return res.status(201).json({ message: "Usuario registrado exitosamente", userId: newUser.id });

  } catch (error) {
    console.error("Error en registro:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};



export const forgot = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "El correo no está registrado" });
    }

    const resetToken = jwt.sign(
      { id: user.id, email: user.email },
      privateKey,
      { algorithm: "RS256", expiresIn: "15m" }
    );

    const resetLink = `http://localhost:5500/EDUVID-frontend/login/reset-password.html?token=${resetToken}`;

    const mailOptions = {
      from: `"Soporte EDUVID" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Recuperación de contraseña",
      html: `
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
          <h2>Restablecer tu contraseña</h2>
          <p>Hemos recibido una solicitud para restablecer tu contraseña.</p>
          <a href="${resetLink}" style="
            display: inline-block;
            margin-top: 20px;
            padding: 12px 20px;
            background-color: #0d6efd;
            color: #ffffff;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
          ">Restablecer Contraseña</a>
          <p style="margin-top: 20px; font-size: 12px; color: #555;">
            Si no solicitaste este cambio, ignora este correo.
          </p>
        </div>
      `
    };

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail(mailOptions);

    res.json({ message: "Correo de recuperación enviado" });
  } catch (error) {
    console.error("Error en forgot:", error);
    res.status(500).json({ message: "Error al procesar la solicitud" });
  }
};



export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: "Token y nueva contraseña son requeridos" });
    }

    // 1. Verificar token
    let decoded;
    try {
      decoded = jwt.verify(token, privateKey, { algorithms: ["RS256"] });
    } catch (err) {
      return res.status(400).json({ message: "Token inválido o expirado" });
    }

    // 2. Buscar usuario
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // 3. Hashear nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 4. Actualizar contraseña en BD
    await user.update({ password: hashedPassword });

    res.json({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    console.error("Error en resetPassword:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};
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