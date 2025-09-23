import express from "express";
import enrollmentsRoutes from "./routes/enrollmentsRoutes.js";
import dotenv from "dotenv";

const app = express();
app.use(express.json());
app.use("/api", enrollmentsRoutes);
dotenv.config();

const PORT = process.env.PORT || 8088;
app.listen(PORT, () => {
  console.log(`User-service corriendo en http://localhost:${PORT}`);
});
