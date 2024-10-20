// routes/userRoutes.js

const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController.js");
const authMiddleware = require("./../middlewares/auth.js"); // Correct path to the auth middleware

// Define routes
router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/me", authMiddleware(['user', 'admin']), userController.getUserData); // Use the authMiddleware correctly

module.exports = router;
