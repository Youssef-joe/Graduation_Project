const User = require("./../models/userModel.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

let register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if all fields are provided
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "All fields are required to be filled" });
    }

    // Check if the user already exists
    let oldUser = await User.findOne({ email });

    if (oldUser) {
      return res
        .status(400)
        .json({ message: "This email is already registered" });
    }

    // Hash the password
    const hashedPass = await bcrypt.hash(password, 10);

    // Create a new user
    let newUser = new User({
      username: name,
      userEmail: email,
      hashedPass: hashedPass,
    });

    // Save the user to the database
    let savedUser = await newUser.save();

    // Respond with success
    res.status(201).json({
      message: "User has been registered successfully",
      data: savedUser,
    });
  } catch (er) {
    console.log(er.message ? er.message : er);
    res.status(500).json({ message: "Server error" });
  }
};

let login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Log the incoming request for debugging
    console.log("Login attempt with:", { email, password });

    if (!email || !password) {
      return res.status(400).json({
        message: "All Fields Are Required To Be Filled",
      });
    }

    // Find the user by email
    const user = await User.findOne({ userEmail: email });
    console.log("Retrieved user:", user); // Add this line to check the user

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    // Check the hashed password
    const isMatch = await bcrypt.compare(password, user.hashedPass);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Respond with success and token
    res.status(200).json({ message: "Logged in successfully", token });
  } catch (er) {
    console.log(er.message ? er.message : er);
    res.status(500).json({
      message: "Failure",
      data: er.message ? er.message : er,
    });
  }
};

let getUserData = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // Fetch user data except the password
    if (!user) {
      return res.status(404).json({
        message: "user not found",
      });
    }
    res.json(user);
  } catch (er) {
    res.status(500).json({ message: "server error" });
    console.error("fetching user data error: ", er.message ? er.message : er);
  }
};

module.exports = {
  register,
  login,
  getUserData,
};
