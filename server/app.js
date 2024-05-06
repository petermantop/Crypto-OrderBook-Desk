require("dotenv").config();
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const { connectRabbitMQ } = require("./src/services/messageService");
const { initializeSocket } = require("./src/services/socketService");

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

io = socketIo(server);

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  // Initialize WebSocket
  initializeSocket(io);

  // connect to RabbitMQ
  connectRabbitMQ()
    .then(() => console.log("Connected to RabbitMQ"))
    .catch((err) => console.error("RabbitMQ connection error:", err));
});
