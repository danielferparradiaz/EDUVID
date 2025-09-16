const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authenticate = require("../middlewares/authMiddleware");

router.post("/register", userController.register); // abierto o protegido, depende de tu diseño
router.get("/profile", authenticate, userController.getProfile);
router.get("/", authenticate, userController.listUsers);

module.exports = router;
