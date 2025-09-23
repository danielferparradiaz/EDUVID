// src/index.js
// ------------------------------
// Entrypoint del microservicio Certificates.
// - Carga variables de entorno (.env en la raíz).
// - Registra middlewares básicos (logger, CORS, JSON).
// - Monta las rutas del servicio en /certificates.
// - No sirve archivos en disco: todo se sirve desde la DB.
// ------------------------------

require("dotenv").config(); // carga .env (debe quedar en la raíz del proyecto)
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const certificatesRoutes = require("./routes/certificatesRoutes");

const app = express();

// Logger HTTP (morgan) — útil para debug y para que los compañeros vean qué requests llegan.
app.use(morgan("dev"));

// CORS básico para permitir llamadas desde el frontend (cambiar en producción).
app.use(cors());

// Permite recibir JSON en el body.
app.use(express.json());

// Monta el router: todas las rutas relativas a /certificates van al módulo de rutas.
app.use("/certificates", certificatesRoutes);

// Levanta el servidor en el puerto definido en .env o 3006 por defecto.
const PORT = process.env.PORT || 3006;
app.listen(PORT, () => {
    console.log(`Certificates service listening on port ${PORT}`);
});
