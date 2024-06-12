const Order = require("../models/order");
const Customer = require("../models/customer");
const addToOrderQueue=require('../utils/orderPubSub')

const addOrder = async (req, res) => {
  try {
    const { email, orderAmount } = req.body;
    if (!orderAmount || !email) {
      return res
        .status(400)
        .send("Please add all fields like email and orderAmount");
    }
    addToOrderQueue({ email, orderAmount });
    res.status(200).json({ message: "Order added to queue" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { addOrder };
