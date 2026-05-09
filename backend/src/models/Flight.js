const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  airline: { type: String, required: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  duration: String,
  price: { type: Number, required: true },
  seats: { type: Number, default: 50 },
  class: { type: String, enum: ['Economy', 'Business', 'First'], default: 'Economy' },
  seatsBooked: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Flight', flightSchema);
