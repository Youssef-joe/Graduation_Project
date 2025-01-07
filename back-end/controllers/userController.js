// controllers/userController.js
const User = require("../models/userModel.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Register a new user
const register = async (req, res) => {
  try {
    const { username, userEmail, password } = req.body;

    // Validate input fields
    if (!username || !userEmail || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check if user already exists
    const oldUser = await User.findOne({ userEmail });
    if (oldUser) {
      return res.status(400).json({ message: "This email is already registered." });
    }

    // Hash the password
    const hashedPass = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      username,
      userEmail,
      hashedPass,
    });

    // Save the user to the database
    const savedUser = await newUser.save();

    // Return success response
    res.status(201).json({
      message: "User registered successfully.",
      data: savedUser,
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

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "1h" }
    );

    // Return success response with token and user data
    res.status(200).json({
      message: "Logged in successfully.",
      token,
      user: {
        id: user._id,
        name: user.username,
        email: user.userEmail,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message || error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Get user profile (excluding password)
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-hashedPass");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

module.exports = { register, login, getProfile };