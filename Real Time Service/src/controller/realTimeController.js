const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const amqp = require("amqplib");

require("dotenv").config({ path: "../../../.env" });

const connectSocket = (server) => {
  console.log("connectSocket=================>");
  //const io = socketIO(server);
  const io = new Server(server, { cors: { origin: "*" } });

  io.use(async (socket, next) => {
    const token = socket.handshake.query.token;

    console.log("token=============>", token);

    console.log("process.env.JWT_KEY-=====>", process.env.JWT_KEY);

    try {
      const decoded = jwt.verify(token, process.env.JWT_KEY);
      console.log("decoded==========>", decoded.id);

      const user = await User.findById(decoded.id);

      if (!user) {
        throw new Error();
      }

      socket.user = user;
      next();
    } catch (error) {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    console.log("New client connected", socket.user.username);

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });

  const consumeQueue = async () => {
    try {
      const connection = await amqp.connect("amqp://localhost:5672");
      const channel = await connection.createChannel();
      await channel.assertQueue("notifications", { durable: true });

      channel.consume("notifications", async (msg) => {
        const notification = JSON.parse(msg.content.toString());

        console.log("notification=======>", notification);

        const userSocket = Array.from(io.sockets.sockets.values()).find(
          (socket) => socket.user._id.toString() === notification.userId
        );

        if (userSocket) {
          userSocket.emit("newNotification", notification);
        } else {
          console.log(`User ${notification.userId} is not connected`);
        }

        channel.ack(msg);
      });
    } catch (error) {
      console.error("Error consuming queue:", error);
    }
  };

  consumeQueue();
};

module.exports = { connectSocket };
