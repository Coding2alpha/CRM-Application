const Order = require("../models/order");
const Customer = require("../models/customer");

const addOrder = async (req, res) => {
  const { email, orderAmount } = req.body;
  try {
    if (!orderAmount || !email) {
      res.status(400).send("Please add all fielda like email and orderAmount");
      return;
    }
    const order = new Order({
      email,
      orderAmount,
    });
    await order.save();

    // Update customer visits and last visit date
    const customer = await Customer.findOneAndUpdate(
      { email },
      {
        $inc: { visits: 1, total_spends: orderAmount },
        last_visit: new Date(),
      }
      //   { new: true, upsert: true } // Create the customer if it doesn't exist
    );

    res.status(201).send("order successfull");
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports = { addOrder };
