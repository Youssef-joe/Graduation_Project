const jwt = require("jsonwebtoken");

const generateTokens = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

module.exports = generateTokens;
