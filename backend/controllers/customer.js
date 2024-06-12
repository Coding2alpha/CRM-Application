const Customer = require("../models/customer");
const addToCustomerQueue = require("../utils/customerPubSub");

const addCustomer = async (req, res) => {
  try {
    const { name, email, total_spends, visits, last_visit } = req.body;
    if (!name || !email || !total_spends) {
      return res
        .status(400)
        .send("Please provide name, email, and total_spends");
    }

    // Check if customer already exists
    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      return res.status(400).send("Customer already exists");
    }

    // Add customer to the queue
    addToCustomerQueue({ name, email, total_spends, visits, last_visit });

    return res.status(200).json({ message: "Customer added to queue" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { addCustomer };
