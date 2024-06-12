const Customer = require("../models/customer");
const addToOrderQueue = require('../utils/orderPubSub');

const addOrder = async (req, res) => {
  try {
    const { email, orderAmount } = req.body;
    if (!orderAmount || !email) {
      return res.status(400).send("Please add all fields like email and orderAmount");
    }
    
    // Check if customer exists
    const existingCustomer = await Customer.findOne({ email });
    if (!existingCustomer) {
      return res.status(400).send("Customer with this email does not exist");
    }
    
    // Add order to the queue
    addToOrderQueue({ email, orderAmount });
    
    return res.status(200).json({ message: "Order added to queue" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { addOrder };
