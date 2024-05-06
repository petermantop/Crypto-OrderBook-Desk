const amqp = require("amqplib");
const logger = require("../utils/logger");

async function connectAndConsume() {
  try {
    // Establish connection to the RabbitMQ server
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    // Ensure the 'orders' queue is declared
    await channel.assertQueue("orders");

    // Log to console that the consumer is waiting for messages
    logger.info("Consumer is waiting for messages. To exit press CTRL+C");

    // Start consuming messages from the 'orders' queue
    channel.consume("orders", (msg) => {
      if (msg !== null) {
        try {
          const message = JSON.parse(msg.content.toString());
          logger.info("Received message: %o", message);
          processMessage(message);
          channel.ack(msg);
        } catch (error) {
          logger.error("Failed to parse message: %s", msg.content.toString());
          // Handle parse error or use channel.nack(msg) to requeue or reject the message
          channel.nack(msg, false, false);
        }
      }
    });
  } catch (error) {
    console.error("Failed to connect or consume:", error);
  }
}

function processMessage(message) {
  // Implement your logic to process the message here
  logger.debug("Processing message: %o", message);
}

module.exports = connectAndConsume;
