require("dotenv").config();
const express = require("express");
const contentRoutes = require("./routes/contentRoutes");
const eureka = require("./config/eureka"); 
const cors = require("cors");

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
