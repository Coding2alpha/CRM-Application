const CommunicationsLog = require("../models/communications_log");

// Dummy vendor API endpoint
const updateStatus = async (req, res) => {
  const { logId, customerEmail, status } = req.body;
  // console.log(req.body);
  try {
    await CommunicationsLog.updateOne(
      { _id: logId, "customers.email": customerEmail },
      { $set: { "customers.$.status": status } }
    );
    res.sendStatus(200);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

module.exports = { updateStatus };
