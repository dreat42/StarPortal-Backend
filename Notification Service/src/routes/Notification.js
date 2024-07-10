const express = require("express");
const Notification = require("../models/notification");

const router = express.Router();

router.get("/api/notifications/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const notification = await Notification.findById(id);

    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    res.status(200).json({ success: true, notification });
  } catch (error) {
    console.error("Error fetching notification:", error);
    res.status(500).json({ error: "Failed to fetch notification" });
  }
});

module.exports = { NotificationRouter: router };
