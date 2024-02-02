const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).send("User already exists with this email.");
    }

    // Create a new user with hashed password
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });

    // Save the user
    await user.save();

    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    res.json(error.message);
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    // Check if user exists and password is correct
    if (user && (await bcrypt.compare(password, user.password))) {
      // Create JWT token
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "3h",
      });
      res.json({ token });
    } else {
      res.status(401).json({ message: "Invalid email or password." });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
