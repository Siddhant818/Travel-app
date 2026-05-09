const mongoose = require('mongoose');

const userDataSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: String }
  },
  { _id: false }
);

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true, lowercase: true, unique: true },
  otp: { type: String, required: true },
  expiry: { type: Date, required: true }, // Explicit expiry for signup verification
  userData: { type: userDataSchema, required: true },
  createdAt: { type: Date, default: Date.now, expires: 600 } // Auto-delete after 10 minutes
});

module.exports = mongoose.model('OTP', otpSchema);
