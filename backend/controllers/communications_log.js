const CommunicationsLog = require("../models/communications_log");
const Customer = require("../models/customer");

// Create a new campaign
// vendor API
const createCampaign = async (req, res) => {
  const userId = req.params.userId;
  const { criteria, message } = req.body;
  const { query } = req.query;
  const { audienceCriteria } = req.audienceCriteria;
  // console.log(audienceCriteria);
  // console.log(criteria, message);

  try {
    const customers = await Customer.find(query);

    // Convert criteria to a readable string
    // const audienceCriteria = criteriaToString(criteria);

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
    // console.log(logEntry);

    // Simulate sending messages and updating statuses
    logEntry.customers.forEach(async (customer) => {
      const status = Math.random() < 0.9 ? "SENT" : "FAILED"; // 90% SENT, 10% FAILED
      console.log(status);
      await fetch(`${process.env.BACKEND_URL}/api/vendorToDummy/updateStatus`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          logId: logEntry._id,
          customerEmail: customer.email,
          status,
        }),
      });
    });

    res.status(201).send(logEntry);
  } catch (error) {
    res.status(400).send({ error: error.message });
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
