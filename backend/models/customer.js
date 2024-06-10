const mongoose=require('mongoose')

const CustomerSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  total_spends: { type: Number, default: 0 },
  visits: { type: Number, default: 0 },
  last_visit: Date,
});

module.exports=mongoose.model('Customer',CustomerSchema)