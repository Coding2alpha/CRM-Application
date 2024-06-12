const mongoose = require("mongoose");

const CommunicationsLogSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  audienceCriteria: {
    type: String, // Description of the audience criteria used for this campaign
    required: true,
  },
  message: {
    type: String, // The message content sent to customers
    required: true,
  },
  customers: [
    {
      email: { type: String, required: true },
      status: {
        type: String,
        enum: ["SENT", "FAILED", "PENDING"],
        default: "SENT",
      },
      deliveryDate: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("CommunicationsLog", CommunicationsLogSchema);
