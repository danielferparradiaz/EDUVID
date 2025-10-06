import dotenv from 'dotenv';
import express from "express";
import sequelize from "./config/db.js";
import progressRoutes from "./routes/routes.js";
import eurekaClient from "./config/eureka.js";
import morgan from "morgan";
import cors from "cors";


dotenv.config();

const app = express();

// Middleware para parsear JSON
app.use(morgan("dev"));
app.use(cors({
  origin: [
    "http://front.eduvid.lan",
    "http://127.0.0.1:5500"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());


app.use("/api", progressRoutes);

const PORT = process.env.PORT || 8097;
app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log("Conexión MySQL exitosa");
    console.log(`progress-service corriendo en http://localhost:${PORT}`);
  } catch (err) {
    console.error("❌ Error al conectar con DB:", err);
  } 
});
