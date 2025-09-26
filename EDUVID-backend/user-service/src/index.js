import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import sequelize from "./config/db.js";
import userRoutes from "./routes/userRoutes.js"; 
import "./config/eureka.js";


dotenv.config();

const app = express();
app.use(morgan("dev"));
app.use(cors({
  origin: "http://localhost:5500", // o el puerto donde sirves tu dashboard.html
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use((req, res, next) => {
  console.log(`📡 Request recibido: ${req.method} ${req.originalUrl}`);
  next();
});
app.use(express.json());

app.use("/api", userRoutes);

const PORT = process.env.PORT || 8092;
app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log("Conexión MySQL exitosa");
    console.log(`User-service corriendo en http://localhost:${PORT}`);
  } catch (err) {
    console.error("❌ Error al conectar con DB:", err);
  }
});
