const express = require("express");

const router = express.Router();

router.post("/api/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // console.log("data============>", req.body);
    const user = new User({ username, email, password });
    await user.save();
    res.status(201).send("User registered successfully");
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
