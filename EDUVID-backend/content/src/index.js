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
    "http://front.eduvid.lan",
    "http://127.0.0.1:5500"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// Rutas
app.use("/lessons", contentRoutes);

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
  console.log(`Content service running on port ${PORT}`);
});
