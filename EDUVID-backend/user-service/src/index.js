import express from "express";
import dotenv from "dotenv";
import sequelize from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";  // 👈 import default

dotenv.config();

const app = express();
app.use(express.json());
app.use("/api", userRoutes);

const PORT = process.env.PORT || 8092;
app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexión MySQL exitosa");
    console.log(`User-service corriendo en http://localhost:${PORT}`);
  } catch (err) {
    console.error("❌ Error al conectar con DB:", err);
  }
});
