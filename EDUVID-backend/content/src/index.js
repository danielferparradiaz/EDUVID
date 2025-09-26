require("dotenv").config();
const express = require("express");
const contentRoutes = require("./routes/contentRoutes");
const eureka = require("./config/eureka"); 

const app = express();
app.use(express.json());

// Rutas
app.use("/lessons", contentRoutes);

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
  console.log(`Content service running on port ${PORT}`);
});
