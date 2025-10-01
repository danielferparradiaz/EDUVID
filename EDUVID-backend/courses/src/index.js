import express from "express";
import coursesRoutes from "./routes/coursesRoutes.js";
import dotenv from "dotenv";
import eurekaClient from "./config/eureka.js";
import morgan from "morgan";
import cors from "cors";




dotenv.config();


const app = express();

// Middleware para parsear JSON
app.use(morgan("dev"));
app.use(cors({
  origin: "http://127.0.0.1:5500",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());

// Rutas
app.use("/api", coursesRoutes);

// Puerto
const PORT = process.env.PORT || 8095;
app.listen(PORT, async () => {
  try {
    console.log(`Course-service corriendo en http://localhost:${PORT}`);
ß
  } catch (err) {
    console.error("❌ Error al conectar con DB:", err);
  }
});






