const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const store = require('../data/store');
const { generateOTP, sendOTPEmail } = require('../utils/otp');
const { JWT_SECRET } = require('../middleware/auth');

// Customer: Request OTP (step 1 of signup)
router.post('/customer/request-otp', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' });

    const exists = store.customers.find(c => c.email === email);
    if (exists) return res.status(409).json({ error: 'Email already registered' });

    const otp = generateOTP();
    const expiry = Date.now() + 10 * 60 * 1000; // 10 min
    store.otps[email] = { otp, expiry, userData: { name, email, password, phone } };

    await sendOTPEmail(email, otp);
    res.json({ message: 'OTP sent to email. Check server console in dev mode.', devOtp: otp });
  } catch (err) {
    console.error('Error in request-otp:', err);
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

// Customer: Verify OTP (step 2 of signup)
router.post('/customer/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  const record = store.otps[email];

  if (!record) return res.status(400).json({ error: 'No OTP requested for this email' });
  if (Date.now() > record.expiry) return res.status(400).json({ error: 'OTP expired' });
  if (record.otp !== otp) return res.status(400).json({ error: 'Invalid OTP' });

  const { name, password, phone } = record.userData;
  const hashed = await bcrypt.hash(password, 10);
  const customer = { id: uuidv4(), name, email, password: hashed, phone, createdAt: new Date() };
  store.customers.push(customer);
  delete store.otps[email];

  const token = jwt.sign({ id: customer.id, email, name, role: 'customer' }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: customer.id, name, email, role: 'customer' } });
});

// Customer: Login
router.post('/customer/login', async (req, res) => {
  const { email, password } = req.body;
  const customer = store.customers.find(c => c.email === email);
  if (!customer) return res.status(404).json({ error: 'Customer not found' });

  const valid = await bcrypt.compare(password, customer.password);
  if (!valid) return res.status(401).json({ error: 'Invalid password' });

  const token = jwt.sign({ id: customer.id, email, name: customer.name, role: 'customer' }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: customer.id, name: customer.name, email, role: 'customer' } });
});

// Vendor: Login
router.post('/vendor/login', async (req, res) => {
  const { email, password } = req.body;
  const vendor = store.vendors.find(v => v.email === email);
  if (!vendor) return res.status(404).json({ error: 'Vendor not found' });

  const valid = await bcrypt.compare(password, vendor.password);
  if (!valid) return res.status(401).json({ error: 'Invalid password' });

  const token = jwt.sign({ id: vendor.id, email, name: vendor.name, role: 'vendor', type: vendor.type, companyName: vendor.companyName }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: vendor.id, name: vendor.name, email, role: 'vendor', type: vendor.type, companyName: vendor.companyName } });
});

module.exports = router;
