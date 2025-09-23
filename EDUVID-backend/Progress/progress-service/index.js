import path from 'path';

console.log("PWD", process.cwd());
console.log("ENV_PATH", path.resolve('.env'));

import dotenv from 'dotenv';
dotenv.config(); // cargar variables de entorno primero

import express from "express";
import cors from "cors";
import morgan from "morgan";
import sequelize from "./config/db.js";
import progressRoutes from "./routes/routes.js";

process.on('uncaughtException', err => {
  console.error('Uncaught Exception:', err);
});
process.on('unhandledRejection', err => {
  console.error('Unhandled Rejection:', err);
});

// debug variables de entorno
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASS:", process.env.DB_PASS);
console.log("DB_NAME:", process.env.DB_NAME);

const app = express();

// Middleware para loguear todas las peticiones entrantes
app.use((req, res, next) => {
  console.log(`Received ${req.method} request for ${req.originalUrl}`);
  next();
});

app.use(morgan("dev"));
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["content-type"]
}));
app.use(express.json());
app.use("/api", progressRoutes);

const PORT = process.env.PORT || 8080;

app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    // Opcional: await sequelize.sync();
    console.log(`✅ Progress-service corriendo en http://localhost:${PORT}`);
  } catch (err) {
    console.error("❌ Error al conectar a la DB:", err);
  }
});
