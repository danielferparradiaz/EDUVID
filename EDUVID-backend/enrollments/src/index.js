import express from "express";
import enrollmentRoutes from "./routes/enrollmentsRoutes.js";
import "./config/eureka.js"; // se inicializa solo

const app = express();
const PORT = 8088;

app.use(express.json());

// Rutas principales
app.use("/api", enrollmentRoutes);

app.listen(PORT, () => {
  console.log(`📘 Enrollment Service corriendo en puerto ${PORT}`);
});
