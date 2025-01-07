// middlewares/auth.js
const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");

const authMiddleware = (allowedRoles = []) => {
  return async (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ message: "No token provided." });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret");
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      if (allowedRoles.length && !allowedRoles.includes(user.role)) {
        return res.status(403).json({ message: "Access denied." });
      }

      req.user = user; // Attach user object to the request
      next();
    } catch (error) {
      console.error("Auth Middleware Error:", error.message || error);
      res.status(401).json({ message: "Invalid token." });
    }
  };
};

module.exports = authMiddleware;