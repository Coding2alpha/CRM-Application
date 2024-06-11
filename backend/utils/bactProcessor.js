
const communications_log = require("../models/communications_log");
require("dotenv").config();

const batchSize = parseInt(process.env.BATCH_SIZE, 10) || 100;
const batchInterval = parseInt(process.env.BATCH_INTERVAL, 10) || 5000;

const queue = [];

// Function to add update requests to the queue
function addToQueue(updateRequest) {
  queue.push(updateRequest);
}

// Function to process the queue in batches
async function processQueue() {
  if (queue.length === 0) {
    return;
  }

  const batch = queue.splice(0, batchSize);
  const count = batch.length;
  console.log(`Number of operations in batch: ${count}`, "batch");
  const bulkOperations = batch.map((update) => ({
    updateOne: {
      filter: { _id: update.logId, "customers.email": update.customerEmail },
      update: { $set: { "customers.$.status": update.status } },
    },
  }));
  //   console.log(bulkOperations[0].updateOne.filter);
  try {
    const result = await communications_log.bulkWrite(bulkOperations, {
      ordered: true,
    });
    // for (const update of batch) {
    //   await communications_log.updateOne(
    //     { _id: update.logId, "customers.email": update.customerEmail },
    //     { $set: { "customers.$.status": update.status } }
    //   );
    //   console.log(
    //     `Updated log ${update.logId} for customer ${update.customerEmail}`
    //   );
    // }
  } catch (error) {
    console.error("Error processing batch", error);
  }
}

// Schedule batch processing at regular intervals
setInterval(processQueue, batchInterval);

module.exports = { addToQueue };
