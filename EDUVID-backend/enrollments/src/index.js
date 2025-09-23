import express from "express";
import enrollmentsRoutes from "./routes/enrollmentsRoutes.js";

const app = express();
app.use(express.json());
app.use("/api", enrollmentsRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`User-service corriendo en http://localhost:${PORT}`);
});
