const amqp = require("amqplib");
const { v4: uuid } = require("uuid");
const { ORDER_TYPES, ORDER_ACTION_TYPES } = require("../../const");
let channel = null;

async function connectRabbitMQ() {
  const connection = await amqp.connect("amqp://localhost");
  channel = await connection.createChannel();

  await channel.assertQueue("orders");
  await channel.assertQueue("orders");

  startOrderGenerator();
  startTradingGenerator();
  return channel;
}

function startOrderGenerator() {
  // Random order generator setup
  const intervalId = setInterval(() => {
    // Decide randomly what order and action to perform
    const orderType = Math.floor(Math.random() * 2); // 0: ask, 1: bid
    const orderActionType = Math.floor(Math.random() * 10); // 0-7: new, 8: modify, 9: cancel order

    const order = orderType ? ORDER_TYPES.ASKS : ORDER_TYPES.BIDS;
    const action =
      orderActionType === 8
        ? ORDER_ACTION_TYPES.MODIFY
        : orderActionType === 9
        ? ORDER_ACTION_TYPES.CANCEL
        : ORDER_ACTION_TYPES.NEW;

    // Send a new order
    const newOrder = {
      id: uuid(),
      type: order,
      actionType: action,
      pairId: Math.ceil(Math.random() * 5),
      price:
        Math.random() * 2000 + (order === ORDER_TYPES.BIDS ? 49000 : 50000),
      quantity: Math.random() * 100,
    };

    // give existing id for update or cancel
    if (action !== ORDER_ACTION_TYPES.NEW) {
      newOrder.id = Math.ceil(Math.random() * 10);
    }

    if (action === ORDER_ACTION_TYPES.CANCEL) {
      delete newOrder.price;
      delete newOrder.quantity;
      delete newOrder.pairId;
    }

    channel.sendToQueue("orders", Buffer.from(JSON.stringify(newOrder)));
  }, 1000); // Generate a new action every 1 seconds
}

function startTradingGenerator() {
  // Random trade generator setup
  const intervalId = setInterval(() => {
    // Send a new trade
    const newTrade = {
      id: uuid(),
      pairId: Math.ceil(Math.random() * 5),
      price: Math.random() * 2000 + 50000,
      quantity: Math.random() * 100,
      timeStamp: new Date(),
    };

    channel.sendToQueue("trades", Buffer.from(JSON.stringify(newTrade)));
  }, 1000); // Generate a new action every 1 seconds
}

module.exports = { connectRabbitMQ };
