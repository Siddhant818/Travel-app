const mongoose = require('mongoose');

const cabSchema = new mongoose.Schema({
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['Mini', 'Sedan', 'SUV'], required: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  price: { type: Number, required: true },
  eta: String,
  capacity: { type: Number, default: 4 },
  ac: { type: Boolean, default: true },
  available: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Cab', cabSchema);
