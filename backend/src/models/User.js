const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  name: String,
  phone: String,
  role: { type: String, enum: ['customer', 'vendor'], required: true },
  type: { type: String, enum: ['flight', 'hotel', 'cab'], default: null }, // for vendors
  companyName: String, // for vendors
  password: String, // hashed
  verified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
