const Customer = require("../models/customer");
const addToCustomerQueue = require("../utils/customerPubSub");

const addCustomer = async (req, res) => {
  try {
    const { name, email, total_spends, visits, last_visit } = req.body;
    if (!name || !email) {
      return res.status(400).send("Please provide name and email");
    }
    addToCustomerQueue({ name, email, total_spends, visits, last_visit });
    res.status(200).json({ message: "Customer added to queue" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { addCustomer };
