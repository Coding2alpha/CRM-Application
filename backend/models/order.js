const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  email: { type: String, required: true },
  orderAmount: Number,
  orderDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", OrderSchema);
