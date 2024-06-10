const express = require("express");
const router = express.Router();
const { updateStatus } = require("../controllers/dummy");

router.route("/updateStatus").post(updateStatus);

module.exports = router;
