const express = require("express");
const router = express.Router();
const controller = require("../controllers/certificatesController");

router.get("/", controller.listCertificates); // ?userId=
router.post("/generate", controller.generateCertificate); // body: { userId, courseId }
router.post("/simulate-event", controller.simulateEvent); // body: { userId, courseId }
router.get("/:id/download", controller.downloadCertificate); // descarga directo desde DB

module.exports = router;
