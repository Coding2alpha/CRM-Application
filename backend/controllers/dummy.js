const CommunicationsLog = require("../models/communications_log");

// Dummy vendor API endpoint
const updateStatus = async (req, res) => {
  const { logId, customerEmail, status } = req.body;
  console.log(req.body);
  // console.log(status);

  try {
    await CommunicationsLog.updateOne(
      { _id: logId, "customers.email": customerEmail },
      { $set: { "customers.$.status": status } }
    );
    return res.sendStatus(200);
  } catch (error) {
    return res.status(400).send({ error: error.message });
  }
};

module.exports = { updateStatus };
