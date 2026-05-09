const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true, lowercase: true, unique: true },
  otp: { type: String, required: true },
  expiry: { type: Date, required: true }, // Explicit expiry for signup verification
  userData: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phone: String
  },
  createdAt: { type: Date, default: Date.now, expires: 600 } // Auto-delete after 10 minutes
});

module.exports = mongoose.model('OTP', otpSchema);
