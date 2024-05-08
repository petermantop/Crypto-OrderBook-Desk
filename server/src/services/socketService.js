// Importing required Socket.IO module
const socketIo = require("socket.io"); // This should be provided if you're using socket.io as an external dependency
const axios = require("axios");

const { getDataMap } = require("../utils/dataProcess");
const logger = require("../utils/logger");
const { TRADING_PLATFORM_URL } = require("../../config");

// Initialize socketIO instance as null to later assign actual Socket.IO server instance
let ioInstance = null;

async function getOrderMap(pairId) {
  try {
    responseBids = await axios.get(
      `${TRADING_PLATFORM_URL}/bids?pairId=${pairId}`
    );
    responseAsks = await axios.get(
      `${TRADING_PLATFORM_URL}/asks?pairId=${pairId}`
    );

    bids = responseBids.data;
    asks = responseAsks.data;

    bids = getDataMap(bids);
    asks = getDataMap(asks);
    return { bids, asks };
  } catch (error) {}
}

function initializeSocket(server) {
  // Creating a socket.io instance attached to the server
  ioInstance = socketIo(server);

  // Connection event
  ioInstance.on("connect", (socket) => {
    logger.info(`Client connected: ${socket.id}`);

    // Initialize a local state for each client
    let count = 0;

    getOrderMap(1).then((result) => {
      broadcast("initial_map", result);
    });

    // Emit the initial counter value to the newly connected client
    socket.emit("counter updated", count);

    // Event listener for receiving counter clicks from the client
    socket.on("counter clicked", () => {
      count++;
      // Emit the updated counter to all clients
      ioInstance.emit("counter updated", count);
    });

    // Example of handling a join room request from a client
    socket.on("join room", (roomName) => {
      socket.join(roomName);
      console.log(`Client ${socket.id} joined room: ${roomName}`);
      socket.emit("joined room", roomName); // Acknowledge the joining
    });
  });

  console.log("Socket.IO initialized and ready for connections.");
}

// Function to broadcast a message to all clients
function broadcast(event, message) {
  if (ioInstance) {
    ioInstance.emit(event, message);
  } else {
    console.error("Socket.IO is not initialized.");
  }
}

// Function to broadcast a message to a specific room
function broadcastToRoom(roomName, message) {
  if (ioInstance) {
    ioInstance.to(roomName).emit("room broadcast", message);
  } else {
    console.error("Socket.IO is not initialized.");
  }
}

// Export functions for external use
module.exports = { initializeSocket, broadcast, broadcastToRoom };
