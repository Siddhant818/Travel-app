const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  city: { type: String, required: true },
  address: String,
  rating: { type: Number, min: 1, max: 5, default: 4 },
  price: { type: Number, required: true },
  amenities: [String],
  roomType: String,
  rooms: { type: Number, default: 20 },
  roomsBooked: { type: Number, default: 0 },
  description: String,
  image: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Hotel', hotelSchema);
