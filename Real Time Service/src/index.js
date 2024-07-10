const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const http = require("http");
const realTimeController = require("./controller/realTimeController");
require("dotenv").config({ path: "../.env" });
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

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

  const server = http.createServer(app);
  realTimeController.connectSocket(server);

  server.listen(5000, () => {
    console.log("Listening on port 5000!!!!!!!!");
  });
};

start();
