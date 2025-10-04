import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import sequelize from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

// Middlewares
app.use(morgan("dev"));
app.use(cors({
  origin: [
    "http://eduvid.local",  // el frontend servido desde tu DNS
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());

// Rutas
app.use("/auth", authRoutes);

// Iniciar servidor
const PORT = process.env.PORT || 9000;
const HOST = "0.0.0.0"; // 👈 habilita conexiones externas

app.listen(PORT, HOST, async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexión MySQL exitosa");
    console.log(`🚀 Auth-service corriendo en http://${HOST}:${PORT}`);
  } catch (err) {
    console.error("❌ Error al conectar con DB:", err);
  }
});

