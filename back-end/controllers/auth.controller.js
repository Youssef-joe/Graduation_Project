const User = require("./../models/userModel.js");
const generation = require("./../utils/generateTokens.js");

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = await User.create({ name, email, password });
    res.status(201).json({ token: generationToken(user) });
  } catch (er) {
    res.status(400).json({ messsage: "Error Registering User" });
    console.error(
      "Error in auth registeration token: ",
      er.message ? er.message : er
    );
  }
};

exports.login = async (req, res) => {
  const { name, email } = req.body;

  try {
    const user = await User.findOne({ email: userEmail });
    if (!user || !(await bcrypt.compare(password, user.hashedPass))) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }
    res.json({ token: generationToken(user) });
  } catch (er) {
    res.status(400).json({ message: "Error Logging In" });
    console.error("Error Auth Login: ", er.message ? er.message : er);
  }
};
