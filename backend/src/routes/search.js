const express = require('express');
const router = express.Router();
const store = require('../data/store');

// Search flights
router.get('/flights', (req, res) => {
  const { from, to, date } = req.query;
  if (date) {
    const selectedDate = new Date(`${date}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (Number.isNaN(selectedDate.getTime()) || selectedDate < today) {
      return res.json([]);
    }
  }
  let results = store.flights;
  if (from) results = results.filter(f => f.from.toLowerCase().includes(from.toLowerCase()));
  if (to) results = results.filter(f => f.to.toLowerCase().includes(to.toLowerCase()));
  if (date) {
    results = results.map((f, index) => ({
      ...f,
      date,
      tripType: index % 2 === 0 ? 'Non-stop' : 'With stop',
      stopsText: index % 2 === 0 ? 'Non-stop' : '1 stop'
    }));
  } else {
    results = results.map((f, index) => ({
      ...f,
      tripType: index % 2 === 0 ? 'Non-stop' : 'With stop',
      stopsText: index % 2 === 0 ? 'Non-stop' : '1 stop'
    }));
  }
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
