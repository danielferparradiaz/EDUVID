import express from "express";
import coursesRoutes from "./routes/coursesRoutes.js";
import dotenv from "dotenv";


const app = express();

// Middleware para parsear JSON
dotenv.config();

app.use(express.json());

// Rutas
app.use("/api", coursesRoutes);

// Puerto
const PORT = process.env.PORT || 8084;
app.listen(PORT, () => {
  console.log(`Course-service corriendo en http://localhost:${PORT}`);
});




