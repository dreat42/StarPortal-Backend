const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const registorUserRouter = require("./routes/registorUser");
const loginUsertRouter = require("./routes/loginUser");
const cors = require("cors");
require("dotenv").config({ path: "../.env" });

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(registorUserRouter);
app.use(loginUsertRouter);

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDb");
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log("Listening on port 3000!!!!!!!!");
  });
};

start();
