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
        logger.info("Received:", msg.content.toString());
        // Acknowledge the message as processed
        channel.ack(msg);
      }
    });
  } catch (error) {
    console.error("Failed to connect or consume:", error);
  }
}
