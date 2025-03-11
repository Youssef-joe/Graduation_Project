// controllers/userController.js
const User = require("../models/userModel.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Generate JWT token
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || "default_secret",
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );

  return accessToken;
};

// Register a new user
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check if user already exists
    const oldUser = await User.findOne({ userEmail: email });
    if (oldUser) {
      return res
        .status(400)
        .json({ message: "This email is already registered." });
    }

    // Hash the password
    const hashedPass = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      username: name,
      userEmail: email,
      hashedPass,
    });

    // Save the user to the database
    const savedUser = await newUser.save();

    // Generate token
    const token = generateTokens(savedUser);

    // Return success response
    res.status(201).json({
      message: "User registered successfully.",
      token,
      user: {
        id: savedUser._id,
        username: savedUser.username,
        userEmail: savedUser.userEmail,
        role: savedUser.role,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Login a user
const login = async (req, res) => {
  try {
    const { userEmail, password } = req.body;

    // Validate input fields
    if (!userEmail || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Find the user by email
    const user = await User.findOne({ userEmail });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.hashedPass);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Generate token
    const token = generateTokens(user);

    // Return success response with token and user data
    res.status(200).json({
      message: "Logged in successfully.",
      token,
      user: {
        id: user._id,
        username: user.username,
        userEmail: user.userEmail,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message || error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const { username, userEmail, currentPassword, newPassword } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Verify current password if provided
    if (currentPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.hashedPass);
      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Current password is incorrect." });
      }
    }

    // Update user fields
    if (username) user.username = username;
    if (userEmail && userEmail !== user.userEmail) {
      // Check if new email is already in use
      const emailExists = await User.findOne({
        userEmail,
        _id: { $ne: userId },
      });
      if (emailExists) {
        return res.status(400).json({ message: "Email is already in use." });
      }
      user.userEmail = userEmail;
    }

    // Update password if provided
    if (newPassword) {
      user.hashedPass = await bcrypt.hash(newPassword, 10);
    }

    // Save updated user
    await user.save();

    // Generate new token
    const token = generateTokens(user);

    // Return success response
    res.json({
      message: "Profile updated successfully.",
      token,
      user: {
        id: user._id,
        username: user.username,
        userEmail: user.userEmail,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Failed to update profile." });
  }
};

// Delete user account
const deleteAccount = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Delete user
    await User.findByIdAndDelete(userId);

    res.json({ message: "Account deleted successfully." });
  } catch (error) {
    console.error("Delete account error:", error);
    res.status(500).json({ message: "Failed to delete account." });
  }
};

// Get user profile
const getProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).select("-hashedPass");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json({
      user: {
        id: user._id,
        username: user.username,
        userEmail: user.userEmail,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Failed to fetch profile." });
  }
};

module.exports = {
  register,
  login,
  updateProfile,
  deleteAccount,
  getProfile,
};
