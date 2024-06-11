const CommunicationsLog = require("../models/communications_log");
const { addToQueue } = require("../utils/bactProcessor");

// Dummy vendor API endpoint
const updateStatus = (req, res) => {
  const { logId, customerEmail, status } = req.body;
  if (!logId || !customerEmail || !status) {
    return res.status(400).send("Missing required fields");
  }

  // console.log(req.body);

  try {
    console.log(status);
    addToQueue({ logId, customerEmail, status });
    return res.sendStatus(202); // 202 Accepted
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

module.exports = { updateStatus };
