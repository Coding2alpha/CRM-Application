const Customer=require('../models/customer')


const addCustomer = async (req, res) => {
  try {
    // console.log(req.body);
    const customer = new Customer(req.body);
    await customer.save();
    res.status(201).send(customer);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = { addCustomer };
