// src/config/db.js
const dotenv = require("dotenv");
const { Sequelize } = require("sequelize");

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME || "eduvid",
  process.env.DB_USER || "root",
  process.env.DB_PASS || "",
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "mysql",
  }
);

sequelize.authenticate()
  .then(() => console.log("✅ Conexión MySQL exitosa"))
  .catch(err => console.error("❌ Error conexión DB:", err));

module.exports = sequelize;
