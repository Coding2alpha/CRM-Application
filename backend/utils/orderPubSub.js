const { EventEmitter } = require("events");
const Order = require("../models/order");
const Customer = require("../models/customer"); // Import Customer model

const orderQueue = [];
const orderEventEmitter = new EventEmitter();

// Function to process the order queue
async function processOrderQueue() {
  if (orderQueue.length === 0) return;

  try {
    const order = orderQueue.shift(); // Get the first order in the queue
    const { email, orderAmount } = order;

    // Save the order
    const newOrder = new Order({ email, orderAmount });
    await newOrder.save();

    console.log(`Order processed: ${email}, Amount: ${orderAmount}`);

    // Emit event to update customer visits and last visit date
    orderEventEmitter.emit("orderProcessed", { email, orderAmount });
  } catch (error) {
    console.error("Error processing order queue", error);
  }
}

// Schedule order processing at regular intervals
setInterval(processOrderQueue, parseInt(process.env.BATCH_INTERVAL, 10));

// Listen for new order requests
orderEventEmitter.on("newOrderRequest", () => {
  processOrderQueue();
});

// Function to add order requests to the queue
function addToOrderQueue(data) {
  orderQueue.push(data);
  orderEventEmitter.emit("newOrderRequest");
}

// Listen for orderProcessed event to update customer
orderEventEmitter.on("orderProcessed", async ({ email, orderAmount }) => {
  try {
    // Update customer visits and last visit date
    await Customer.findOneAndUpdate(
      { email },
      {
        $inc: { visits: 1, total_spends: orderAmount },
        last_visit: new Date(),
      }
    );
    console.log(`Customer updated: ${email}`);
  } catch (error) {
    console.error("Error updating customer", error);
  }
});


module.exports = addToOrderQueue;
