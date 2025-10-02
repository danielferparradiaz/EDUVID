import express from "express";
import dotenv from "dotenv";
import eurekaClient from "./config/eureka.js";
import morgan from "morgan";
import cors from "cors";
import enrollmentRoutes from "./routes/enrollmentsRoutes.js";

dotenv.config();

const app = express();

app.use(morgan("dev"));
app.use(cors({
  origin: "http://127.0.0.1:5500",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

// Rutas principales
app.use("/api", enrollmentRoutes);

const PORT = process.env.PORT || 8088;
app.listen(PORT, async () => {
  try {
    console.log(`Course-service corriendo en http://localhost:${PORT}`);
ß
  } catch (err) {
    console.error("❌ Error al conectar con DB:", err);
  }
});



