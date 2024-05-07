const axios = require("axios");
const logger = require("../utils/logger");
const { TRADING_PLATFORM_URL } = require("../../config");
const { ORDER_TYPES, ORDER_ACTION_TYPES } = require("../../const");

// To enable sync with json-server change SEND_REQUEST to true
const shouldSendRequest = process.env.SEND_REQUEST !== "false";

async function processOrderMessage(message) {
  // Implement your logic to process the message here
  logger.info("Processing order message: %o", message);

  if (!shouldSendRequest) {
    logger.info("Request sending is disabled.");
    return;
  }

  try {
    switch (message.actionType) {
      case ORDER_ACTION_TYPES.NEW:
        // Handle new order creation
        const responseNew = await axios.post(
          `${TRADING_PLATFORM_URL}/${message.type}`,
          {
            id: message.id,
            pairId: message.pairId,
            price: message.price,
            quantity: message.quantity,
          }
        );
        logger.info("New order created: %o", responseNew.data);
        break;

      case ORDER_ACTION_TYPES.MODIFY:
        // Handle order modification
        const responseModify = await axios.patch(
          `${TRADING_PLATFORM_URL}/${message.type}/${message.id}`,
          {
            price: message.price,
            quantity: message.quantity,
          }
        );
        logger.info("Order modified: %o", responseModify.data);
        break;

      case ORDER_ACTION_TYPES.CANCEL:
        // Handle order cancellation
        const responseCancel = await axios.delete(
          `${TRADING_PLATFORM_URL}/${message.type}/${message.id}`
        );
        logger.info("Order cancelled: %o", responseCancel.data);
        break;

      default:
        // Log an unhandled action type
        logger.warn("Unhandled action type: %s", message.actionType);
    }
  } catch (error) {
    // Log errors if the HTTP request failed
    logger.error("Error processing message: %s", error.message);
  }
}

async function processTradeMessage(message) {
  // Implement your logic to process the message here
  logger.info("Processing trade message: %o", message);

  if (!shouldSendRequest) {
    logger.info("Request sending is disabled.");
    return;
  }

  try {
    // Handle new order creation
    const responseNew = await axios.post(`${TRADING_PLATFORM_URL}/trades`, {
      id: message.id,
      pairId: message.pairId,
      price: message.price,
      quantity: message.quantity,
      timeStamp: message.timeStamp,
    });
    logger.info("New trade created: %o", responseNew.data);
  } catch (error) {
    // Log errors if the HTTP request failed
    logger.error("Error processing message: %s", error.message);
  }
}

module.exports = { processOrderMessage, processTradeMessage };
