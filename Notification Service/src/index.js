const express = require("express");
const mongoose = require("mongoose");
const { changeNotificationRouter } = require("./routes/ChangeNotification");
const { listNotificationRouter } = require("./routes/ListNotification");
const { NotificationRouter } = require("./routes/Notification");
const { createNotificationRouter } = require("./routes/CreateNotification");
const bodyParser = require("body-parser");
require("dotenv").config({ path: "../.env" });

const app = express();

app.use(bodyParser.json());

app.use(createNotificationRouter);
app.use(NotificationRouter);
app.use(listNotificationRouter);
app.use(changeNotificationRouter);

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

  app.listen(4000, () => {
    console.log("Listening on port 4000!!!!!!!!");
  });
};

start();
