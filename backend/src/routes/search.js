const express = require('express');
const router = express.Router();
const store = require('../data/store');

// Search flights
router.get('/flights', (req, res) => {
  const { from, to, date } = req.query;
  let results = store.flights;
  if (from) results = results.filter(f => f.from.toLowerCase().includes(from.toLowerCase()));
  if (to) results = results.filter(f => f.to.toLowerCase().includes(to.toLowerCase()));
  if (date) results = results.filter(f => f.date === date);
  res.json(results);
});

// Search hotels
router.get('/hotels', (req, res) => {
  const { city } = req.query;
  let results = store.hotels;
  if (city) results = results.filter(h => h.city.toLowerCase().includes(city.toLowerCase()));
  res.json(results);
});

// Search cabs
router.get('/cabs', (req, res) => {
  const { from } = req.query;
  let results = store.cabs;
  if (from) results = results.filter(c => c.from.toLowerCase().includes(from.toLowerCase()));
  res.json(results);
});

module.exports = router;
