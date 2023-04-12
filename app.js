require("dotenv").config();
const express = require("express");
const connectDB = require("./config/dbConfig");
const User = require("./model/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// app
const app = express();
connectDB();
app.use(express.json());

// register
app.post("/register", async (req, res) => {
  try {
    // our register logic
    const { first_name, last_name, email, password } = req.body;
    if (!(email && password && first_name && last_name)) {
      return res.status(400).end("All inputs are required");
    }

    const already_reg = await User.findOne({ email });
    if (already_reg) {
      return res.status(409).end("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      first_name,
      last_name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });
    const jwtToken = jwt.sign(
      {
        user_id: user._id,
        email,
      },
      process.env.TOKEN_KEY,
      {
        expiresIn: "1m",
      }
    );
    user.token = jwtToken;

    res.status(201).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user && (await bcrypt.compare(password, user.password))) {
      const jwtToken = jwt.sign(
        {
          user_id: user._id,
          email,
        },
        process.env.TOKEN_KEY,
        {
          expiresIn: "1m",
        }
      );
      user.token = jwtToken;
      return res.status(200).json(user.token);
    } else {
      return res.status(400).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = app;
