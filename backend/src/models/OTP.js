const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true, lowercase: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, default: () => new Date(Date.now() + 10 * 60 * 1000) }, // 10 minutes
  userData: { // Store user data temporarily before verification
    name: String,
    phone: String,
    role: String,
    type: String,
    companyName: String
  },
  createdAt: { type: Date, default: Date.now, expires: 600 } // Auto-delete after 10 minutes
});

module.exports = mongoose.model('OTP', otpSchema);
