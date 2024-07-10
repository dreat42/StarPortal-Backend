const io = require("socket.io-client");

let connection = new Map();

const connectSocket = (token, email) => {
  return new Promise((res, rej) => {
    console.log("Inside promise==============>");

    const socket = io("http://localhost:5000", {
      query: { token: token },

      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("Connected to socket server");
      connection.set(email, socket);
      res(socket);
    });

    socket.on("newNotification", (notification) => {
      console.log("New notification received:", notification);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from socket server");
      connection.delete(email);
    });

    socket.on("connect_error", (error) => {
      console.log("Connection error:", error);
      rej(error);
    });

    socket.on("error", (error) => {
      console.log("Socket error:", error);
      rej(error);
    });
  });
};

module.exports = connectSocket;
