const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const store = require('../data/store');
const { customerMiddleware, vendorMiddleware, authMiddleware } = require('../middleware/auth');

// Customer: Create booking
router.post('/', customerMiddleware, (req, res) => {
  const { serviceType, serviceId, details } = req.body;
  if (!serviceType || !serviceId) return res.status(400).json({ error: 'Missing booking details' });

  let service, vendorId;
  if (serviceType === 'flight') {
    service = store.flights.find(f => f.id === serviceId);
  } else if (serviceType === 'hotel') {
    service = store.hotels.find(h => h.id === serviceId);
  } else if (serviceType === 'cab') {
    service = store.cabs.find(c => c.id === serviceId);
  }

  if (!service) return res.status(404).json({ error: 'Service not found' });
  vendorId = service.vendorId;

  const booking = {
    id: uuidv4(),
    customerId: req.user.id,
    customerName: req.user.name,
    customerEmail: req.user.email,
    vendorId,
    serviceType,
    serviceId,
    service,
    details: details || {},
    status: 'pending', // pending -> accepted -> delivered
    createdAt: new Date(),
    updatedAt: new Date()
  };

  store.bookings.push(booking);
  store.messages[booking.id] = [];
  res.status(201).json(booking);
});

// Customer: Get my bookings
router.get('/my', customerMiddleware, (req, res) => {
  const myBookings = store.bookings
    .filter(b => b.customerId === req.user.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(myBookings);
});

// Vendor: Get bookings for me
router.get('/vendor', vendorMiddleware, (req, res) => {
  const myBookings = store.bookings
    .filter(b => b.vendorId === req.user.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(myBookings);
});

// Vendor: Accept booking
router.patch('/:id/accept', vendorMiddleware, (req, res) => {
  const booking = store.bookings.find(b => b.id === req.params.id && b.vendorId === req.user.id);
  if (!booking) return res.status(404).json({ error: 'Booking not found' });
  if (booking.status !== 'pending') return res.status(400).json({ error: 'Booking already processed' });

  booking.status = 'accepted';
  booking.updatedAt = new Date();
  res.json(booking);
});

// Vendor: Mark as delivered
router.patch('/:id/deliver', vendorMiddleware, (req, res) => {
  const booking = store.bookings.find(b => b.id === req.params.id && b.vendorId === req.user.id);
  if (!booking) return res.status(404).json({ error: 'Booking not found' });
  if (booking.status !== 'accepted') return res.status(400).json({ error: 'Must accept first' });

  booking.status = 'delivered';
  booking.updatedAt = new Date();
  res.json(booking);
});

// Messages: Get messages for a booking
router.get('/:id/messages', authMiddleware, (req, res) => {
  const booking = store.bookings.find(b => b.id === req.params.id);
  if (!booking) return res.status(404).json({ error: 'Booking not found' });

  // Ensure requester is customer or vendor of this booking
  if (req.user.role === 'customer' && booking.customerId !== req.user.id)
    return res.status(403).json({ error: 'Access denied' });
  if (req.user.role === 'vendor' && booking.vendorId !== req.user.id)
    return res.status(403).json({ error: 'Access denied' });

  res.json(store.messages[req.params.id] || []);
});

// Messages: Send a message
router.post('/:id/messages', authMiddleware, (req, res) => {
  const booking = store.bookings.find(b => b.id === req.params.id);
  if (!booking) return res.status(404).json({ error: 'Booking not found' });

  if (req.user.role === 'customer' && booking.customerId !== req.user.id)
    return res.status(403).json({ error: 'Access denied' });
  if (req.user.role === 'vendor' && booking.vendorId !== req.user.id)
    return res.status(403).json({ error: 'Access denied' });

  const message = {
    id: uuidv4(),
    sender: req.user.name,
    role: req.user.role,
    text: req.body.text,
    time: new Date()
  };

  if (!store.messages[req.params.id]) store.messages[req.params.id] = [];
  store.messages[req.params.id].push(message);
  res.status(201).json(message);
});

module.exports = router;
