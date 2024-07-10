const express = require("express");
const router = express.Router();
const Notification = require("../models/notification");

const rabbitMQ = require("../queue/rabbitMQ");

router.post("/api/notifications", async (req, res) => {
  try {
    const { userId, message } = req.body;

    const notification = new Notification({ userId, message });

    await notification.save();

    rabbitMQ.sendToQueue("notifications", notification);

    res.status(201).json(notification);
  } catch (error) {
    console.error("Error creating notification:", error);

    res.status(500).json({ error: "Failed to create notification" });
  }
});

module.exports = { createNotificationRouter: router };
