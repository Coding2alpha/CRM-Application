const express = require("express");
const router = express.Router();
const buildQuery = require("../middleware/buildQuery");
const criteriaToString = require("../middleware/criteriaToString");
const {
  createCampaign,
  audience,
  getAllCampaign,
  stats,
} = require("../controllers/communications_log");

router
  .route("/createCampaign/:userId")
  .post(buildQuery, criteriaToString, createCampaign);
router.route("/audience").post(buildQuery, audience);
router.route("/getAllCampaign/:userId").get(getAllCampaign);
router.route("/stats").get(stats);

module.exports = router;
