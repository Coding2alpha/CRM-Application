const express = require("express");
require("dotenv").config();
const cors = require("cors");
const connectDB = require("./db/connect");
const customerRouter = require("./routes/customer");
const orderRouter = require("./routes/order");
const campaignsRouter = require("./routes/communications_log");
const dummyApiRouter = require("./routes/deliveryReceipt.js");
const CommunicationsLog = require("./models/communications_log.js");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send({ msg: "Welcome To CRM Application" });
});

app.use("/api/customers", customerRouter);
app.use("/api/orders", orderRouter);
app.use("/api/campaigns", campaignsRouter);
app.use("/api/vendorToDummy", dummyApiRouter);

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
