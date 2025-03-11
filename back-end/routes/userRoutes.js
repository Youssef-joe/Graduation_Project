// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/auth");

// Public routes
router.post("/register", userController.register);
router.post("/login", userController.login);

// Protected routes
router.get("/profile", authMiddleware(), userController.getProfile);
router.put("/profile", authMiddleware(), userController.updateProfile);
router.delete("/profile", authMiddleware(), userController.deleteAccount);

module.exports = router;
