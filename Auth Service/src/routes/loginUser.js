const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const connectSocket = require("../socket/connection");

require("dotenv").config({ path: "../../.env" });

const router = express.Router();

router.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).send("Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send("Invalid email or password");
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_KEY, {
      expiresIn: "1h",
    });

    console.log("token========>", connectSocket);
    await connectSocket(token, email);

    res.status(200).send({ token });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(400).send(error.message);
  }
});

module.exports = router;
