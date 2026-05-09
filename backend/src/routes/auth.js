const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const OTP = require('../models/OTP');
const { generateOTP, sendOTPEmail } = require('../utils/otp');
const { JWT_SECRET } = require('../middleware/auth');

// Customer: Request OTP (step 1 of signup)
router.post('/customer/request-otp', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' });

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(409).json({ error: 'Email already registered' });

    // Generate OTP
    const otp = generateOTP();
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    // Save OTP to database using a plain document write to avoid update casting issues
    await OTP.deleteOne({ email });
    await OTP.create({
      email,
      otp,
      expiry,
      userData: { name, email, password, phone }
    });

    // Send OTP email
    await sendOTPEmail(email, otp);
    res.json({ message: 'OTP sent to email. Check server console in dev mode.', devOtp: otp });
  } catch (err) {
    console.error('Error in request-otp:', err);
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

// Customer: Verify OTP (step 2 of signup)
router.post('/customer/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ error: 'Missing email or OTP' });

    // Find OTP record
    const otpRecord = await OTP.findOne({ email });
    if (!otpRecord) return res.status(400).json({ error: 'No OTP requested for this email' });

    // Check expiry
    if (new Date() > otpRecord.expiry) {
      await OTP.deleteOne({ email });
      return res.status(400).json({ error: 'OTP expired' });
    }

    // Verify OTP
    if (otpRecord.otp !== otp) return res.status(400).json({ error: 'Invalid OTP' });

    // Create user
    const { name, password, phone } = otpRecord.userData;
    const hashed = await bcrypt.hash(password, 10);
    
    const user = new User({
      name,
      email,
      password: hashed,
      phone: phone || '',
      role: 'customer'
    });

    await user.save();

    // Delete OTP record
    await OTP.deleteOne({ email });

    // Generate token
    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name, role: 'customer' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: 'customer' } });
  } catch (err) {
    console.error('Error in verify-otp:', err);
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

// Customer: Login
router.post('/customer/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Missing email or password' });

    const user = await User.findOne({ email, role: 'customer' });
    if (!user) return res.status(404).json({ error: 'Customer not found' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid password' });

    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name, role: 'customer' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: 'customer' } });
  } catch (err) {
    console.error('Error in customer login:', err);
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

// Vendor: Login
router.post('/vendor/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Missing email or password' });

    const vendor = await User.findOne({ email, role: 'vendor' });
    if (!vendor) return res.status(404).json({ error: 'Vendor not found' });

    const valid = await bcrypt.compare(password, vendor.password);
    if (!valid) return res.status(401).json({ error: 'Invalid password' });

    const token = jwt.sign(
      {
        id: vendor._id,
        email: vendor.email,
        name: vendor.name,
        role: 'vendor',
        type: vendor.vendorType,
        companyName: vendor.companyName
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: vendor._id,
        name: vendor.name,
        email: vendor.email,
        role: 'vendor',
        type: vendor.vendorType,
        companyName: vendor.companyName
      }
    });
  } catch (err) {
    console.error('Error in vendor login:', err);
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

module.exports = router;
