const express = require("express");
const Notification = require("../models/notification");

const router = express.Router();

router.get("/api/notifications", async (req, res) => {
  try {
    const notifications = await Notification.find();
    res.status(200).json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve notifications" });
  }
});

module.exports = { listNotificationRouter: router };
