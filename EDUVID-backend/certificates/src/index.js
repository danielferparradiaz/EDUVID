require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const certificatesRoutes = require("./routes/certificatesRoutes");

const app = express();
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

app.use("/certificates", certificatesRoutes);

const PORT = process.env.PORT || 3006;
app.listen(PORT, () => {
    console.log(`Certificates service listening on port ${PORT}`);
});
