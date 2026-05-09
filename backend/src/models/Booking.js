const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  serviceType: { type: String, enum: ['flight', 'hotel', 'cab'], required: true },
  serviceId: { type: mongoose.Schema.Types.ObjectId, required: true }, // References Flight, Hotel, or Cab
  service: {
    name: String,
    airline: String,
    from: String,
    to: String,
    date: String,
    time: String,
    price: Number,
    city: String,
    roomType: String
  },
  customerName: String,
  customerEmail: String,
  status: { type: String, enum: ['pending', 'accepted', 'delivered', 'cancelled'], default: 'pending' },
  totalPrice: Number,
  paymentStatus: { type: String, enum: ['pending', 'paid', 'refunded'], default: 'pending' },
  details: {
    passengers: Number,
    nights: Number,
    notes: String
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);
