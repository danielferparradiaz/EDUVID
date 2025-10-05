import dotenv from "dotenv";
import express from "express";
import cors from "cors";

import contentRoutes from "./routes/contentRoutes.js";
import eureka from "./config/eureka.js"; 

const app = express();
app.use(express.json());

// ✅ Configuración de CORS
app.use(cors({
  origin: [
    "http://127.0.0.1:5500", // tu frontend corriendo con Live Server
    "http://localhost:5500"  // por si cambia a localhost
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Rutas
app.use("/lessons", contentRoutes);

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
  console.log(`Content service running on port ${PORT}`);
});
