const { EventEmitter } = require("events");
const Customer = require("../models/customer");

const customerQueue = [];
const customerEventEmitter = new EventEmitter();

// Function to process the queue in batches
async function processCustomerQueue() {
  if (customerQueue.length === 0) return;

  const batchSize = parseInt(process.env.BATCH_SIZE, 10);
  const batch = customerQueue.splice(0, batchSize);
  console.log(`Number of operations in customer batch: ${batch.length}`);

  try {
    const customersToInsert = batch.map((data) => new Customer(data));
    await Customer.insertMany(customersToInsert);
    console.log(`Customer batch processed: ${batch.length} customers`);
  } catch (error) {
    console.error("Error processing customer batch", error);
  }
}

// Schedule batch processing at regular intervals
setInterval(processCustomerQueue, parseInt(process.env.BATCH_INTERVAL, 10));

// Listen for new customer requests to process the queue immediately if needed
customerEventEmitter.on("newCustomerRequest", () => {
  if (customerQueue.length >= parseInt(process.env.BATCH_SIZE, 10)) {
    processCustomerQueue();
  }
});

// Function to add customer requests to the queue
function addToCustomerQueue(data) {
  customerQueue.push(data);
  customerEventEmitter.emit("newCustomerRequest");
}

module.exports = addToCustomerQueue ;
