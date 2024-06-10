const express = require("express");
const router = express.Router();
const { addOrder } = require("../controllers/order");

router.route("/addOrder").post(addOrder);

module.exports = router;
