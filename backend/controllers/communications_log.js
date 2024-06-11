const CommunicationsLog = require("../models/communications_log");
const Customer = require("../models/customer");

// Create a new campaign
// vendor API
const createCampaign = async (req, res) => {
  const userId = req.params.userId;
  const { criteria, message } = req.body;
  const { query } = req.query;
  const audienceCriteria = req.audienceCriteria.toString(); // Convert to string

  try {
    // Evaluate audience criteria (example)
    const customers = await Customer.find(query);

    // Create communications log
    const logEntry = new CommunicationsLog({
      userId,
      audienceCriteria,
      message,
      customers: customers.map((customer) => ({
        email: customer.email,
        status: "SENT", // Initial status; could be SENT or FAILED based on the actual delivery
      })),
    });
    await logEntry.save();

    // Simulate sending messages and updating statuses
    const updateStatusPromises = logEntry.customers.map(async (customer) => {
      const status = Math.random() < 0.6 ? "SENT" : "FAILED"; // 90% SENT, 10% FAILED
      // console.log(status);
      return await fetch(
        `${process.env.BACKEND_URL}/api/vendorToDummy/updateStatus`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            logId: logEntry._id,
            customerEmail: customer.email,
            status,
          }),
        }
      );
    });

    // Wait for all status updates to complete
    await Promise.all(updateStatusPromises);

    // Fetch the data after saving
    const data = await CommunicationsLog.find({
      _id: logEntry._id,
    });

    // Send the response after all operations are complete
    return res.status(201).send(data);
  } catch (error) {
    // Check if headers have already been sent
    if (!res.headersSent) {
      return res.status(400).send({ error: error.message });
    } else {
      console.error("Error after headers sent:", error);
    }
  }
};

const audience = async (req, res) => {
  const { query } = req.query;
  // console.log(criteria);
  // console.log(query);
  try {
    // const query = buildQuery(criteria);

    const customers = await Customer.find(query);
    res.status(200).send({ count: customers.length, customers });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

// Route to get all campaigns
const getAllCampaign = async (req, res) => {
  try {
    const userId = req.params.userId; // Extract userId from request parameters
    // console.log(userId);
    const campaigns = await CommunicationsLog.find({ userId }).sort({
      createdAt: -1,
    });
    res.status(200).send(campaigns);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const stats = async (req, res) => {
  try {
    const userId = req.params.userId;
    const campaigns = await CommunicationsLog.find({ userId }).sort({
      createdAt: -1,
    });

    // Add delivery stats to particular user
    const campaignsWithStats = campaigns.map((campaign) => {
      const totalCustomers = campaign.customers.length;
      const sentCount = campaign.customers.filter(
        (customer) => customer.status === "SENT"
      ).length;
      const failedCount = totalCustomers - sentCount;

      return {
        totalCustomers,
        sentCount,
        failedCount,
      };
    });

    res.status(200).send(campaignsWithStats);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

module.exports = { createCampaign, audience, getAllCampaign, stats };
