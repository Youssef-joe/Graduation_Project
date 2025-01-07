const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

let userSchema = new mongoose.Schema({
  username: {
    type: String,
    trim: true,
    required: [true, "name is required"],
  },
  userEmail: {
    type: String,
    required: [true, "email is required"],
    unique: true,
    lowercase: true,
  },
  hashedPass: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.hashedPass = await bcrypt.hash(this.hashedPass, 10);
  next();
});

const User = mongoose.model("user", userSchema);

module.exports = User;
