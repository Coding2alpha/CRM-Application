const express = require("express");
require("dotenv").config();
const cors = require("cors");
const connectDB = require("./db/connect");
const customerRouter = require("./routes/customer");
const orderRouter = require("./routes/order");
const campaignsRouter = require("./routes/communications_log");
const dummyApiRouter = require("./routes/dummy.js");
const CommunicationsLog = require("./models/communications_log.js");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome To CRM Application");
});

app.use("/api/customers", customerRouter);
app.use("/api/orders", orderRouter);
app.use("/api/campaigns", campaignsRouter);
app.use("/api/vendorToDummy", dummyApiRouter);

app.get("/campaigns", async (req, res) => {
  try {
    const campaigns = await CommunicationsLog.find().sort({ createdAt: -1 });

    // Add delivery stats
    const campaignsWithStats = campaigns.map((campaign) => {
      const totalCustomers = campaign.customers.length;
      const sentCount = campaign.customers.filter(
        (customer) => customer.status === "SENT"
      ).length;
      const failedCount = totalCustomers - sentCount;

      return {
        ...campaign.toObject(),
        totalCustomers,
        sentCount,
        failedCount,
      };
    });

    res.status(200).send(campaignsWithStats);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log("connect with database");
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
