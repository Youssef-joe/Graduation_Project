// middlewares/auth.js
const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");

const authMiddleware = (allowedRoles = []) => {
  return async (req, res, next) => {
    try {
      // Get token from header
      const token = req.header("Authorization")?.replace("Bearer ", "");

      if (!token) {
        return res.status(401).json({
          message: "Authentication required. Please login.",
          code: "NO_TOKEN",
        });
      }

      // Verify token
      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret");
      } catch (error) {
        if (error.name === "TokenExpiredError") {
          return res.status(401).json({
            message: "Token has expired. Please login again.",
            code: "TOKEN_EXPIRED",
          });
        }
        return res.status(401).json({
          message: "Invalid token. Please login again.",
          code: "INVALID_TOKEN",
        });
      }

      // Find user
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(404).json({
          message: "User not found. Please login again.",
          code: "USER_NOT_FOUND",
        });
      }

      // Check role if required
      if (allowedRoles.length && !allowedRoles.includes(user.role)) {
        return res.status(403).json({
          message: "You don't have permission to access this resource.",
          code: "INSUFFICIENT_PERMISSIONS",
        });
      }

      // Attach user to request
      req.user = user;
      next();
    } catch (error) {
      console.error("Auth Middleware Error:", error.message || error);
      res.status(500).json({
        message: "Internal server error during authentication.",
        code: "AUTH_ERROR",
      });
    }
  };
};

module.exports = authMiddleware;
