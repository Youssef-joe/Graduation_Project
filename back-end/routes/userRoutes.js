// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController.js");
const authMiddleware = require("../middlewares/auth.js");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/profile", authMiddleware(), userController.getProfile);

module.exports = router;