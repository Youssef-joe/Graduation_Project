// middlewares/auth.js

const jwt = require('jsonwebtoken');
const User = require('../models/userModel.js'); // Ensure correct path

const authMiddleware = (allowedRoles = []) => {
  return async (req, res, next) => {
    // Get token from the request headers
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'No token provided, authorization denied' });
    }

    try {
      // Verify the JWT token using the secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Attach decoded data (e.g., user ID) to the request object
      req.user = decoded;

      // Find the user in the database based on the decoded token's ID
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Check if the user's role is allowed to access the current route
      if (allowedRoles.length && !allowedRoles.includes(user.role)) {
        return res.status(403).json({ message: 'Access denied, insufficient permissions' });
      }

      // User is authenticated and authorized, move to the next middleware
      next();
    } catch (error) {
      console.error('Token verification error:', error.message);
      return res.status(401).json({ message: 'Invalid token, authorization denied' });
    }
  };
};

module.exports = authMiddleware;
