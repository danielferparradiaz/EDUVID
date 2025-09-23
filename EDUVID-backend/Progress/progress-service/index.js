import dotenv from 'dotenv';
import express from "express";
import cors from "cors";
import morgan from "morgan";
import sequelize from "./config/db.js";
import progressRoutes from "./routes/routes.js";

dotenv.config(); // cargar variables de entorno primero


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

const PORT = process.env.PORT || 8012;

app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    // Opcional: await sequelize.sync();
    console.log(`✅ Progress-service corriendo en http://localhost:${PORT}`);
  } catch (err) {
    console.error("❌ Error al conectar a la DB:", err);
  }
});
