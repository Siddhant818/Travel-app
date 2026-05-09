require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');

const User = require('../models/User');
const Flight = require('../models/Flight');
const Hotel = require('../models/Hotel');
const Cab = require('../models/Cab');

const FLIGHT_DATA = [
  // Delhi ↔ Mumbai
  { airline: 'IndiGo', from: 'Delhi', to: 'Mumbai', date: '2026-05-20', time: '06:00', duration: '2h 15m', price: 3500, seats: 50 },
  { airline: 'Air India', from: 'Delhi', to: 'Mumbai', date: '2026-05-20', time: '10:00', duration: '2h 15m', price: 4200, seats: 40 },
  { airline: 'SpiceJet', from: 'Delhi', to: 'Mumbai', date: '2026-05-20', time: '15:00', duration: '2h 20m', price: 3200, seats: 45 },
  { airline: 'Vistara', from: 'Delhi', to: 'Mumbai', date: '2026-05-21', time: '08:30', duration: '2h 15m', price: 4800, seats: 35 },

  // Delhi ↔ Bangalore
  { airline: 'IndiGo', from: 'Delhi', to: 'Bangalore', date: '2026-05-20', time: '07:00', duration: '2h 45m', price: 3800, seats: 48 },
  { airline: 'SpiceJet', from: 'Delhi', to: 'Bangalore', date: '2026-05-21', time: '09:00', duration: '2h 45m', price: 3500, seats: 50 },

  // Mumbai ↔ Bangalore
  { airline: 'Air India', from: 'Mumbai', to: 'Bangalore', date: '2026-05-20', time: '11:00', duration: '1h 45m', price: 2800, seats: 42 },
  { airline: 'IndiGo', from: 'Mumbai', to: 'Bangalore', date: '2026-05-21', time: '14:30', duration: '1h 45m', price: 3100, seats: 50 },

  // Bangalore ↔ Hyderabad
  { airline: 'SpiceJet', from: 'Bangalore', to: 'Hyderabad', date: '2026-05-20', time: '08:00', duration: '1h 20m', price: 2400, seats: 50 },
  { airline: 'Vistara', from: 'Bangalore', to: 'Hyderabad', date: '2026-05-21', time: '16:00', duration: '1h 20m', price: 3200, seats: 38 },

  // Chennai ↔ Hyderabad
  { airline: 'IndiGo', from: 'Chennai', to: 'Hyderabad', date: '2026-05-20', time: '10:00', duration: '1h 15m', price: 2200, seats: 50 },
  { airline: 'Air India', from: 'Chennai', to: 'Hyderabad', date: '2026-05-21', time: '13:00', duration: '1h 15m', price: 2900, seats: 40 },

  // Mumbai ↔ Hyderabad
  { airline: 'SpiceJet', from: 'Mumbai', to: 'Hyderabad', date: '2026-05-20', time: '12:00', duration: '1h 10m', price: 2500, seats: 48 },
  { airline: 'Vistara', from: 'Mumbai', to: 'Hyderabad', date: '2026-05-22', time: '18:00', duration: '1h 10m', price: 3400, seats: 35 },

  // Delhi ↔ Chennai
  { airline: 'Air India', from: 'Delhi', to: 'Chennai', date: '2026-05-20', time: '05:30', duration: '3h 00m', price: 4500, seats: 45 },
  { airline: 'IndiGo', from: 'Delhi', to: 'Chennai', date: '2026-05-21', time: '09:00', duration: '3h 00m', price: 6800, seats: 50 },

  // Pune ↔ Mumbai
  { airline: 'SpiceJet', from: 'Pune', to: 'Mumbai', date: '2026-05-20', time: '07:30', duration: '55m', price: 2200, seats: 50 },
  { airline: 'IndiGo', from: 'Pune', to: 'Mumbai', date: '2026-05-22', time: '14:00', duration: '55m', price: 2400, seats: 45 },

  // Bangalore ↔ Pune
  { airline: 'Air India', from: 'Bangalore', to: 'Pune', date: '2026-05-20', time: '09:00', duration: '1h 25m', price: 3100, seats: 42 },
  { airline: 'Vistara', from: 'Bangalore', to: 'Pune', date: '2026-05-21', time: '17:00', duration: '1h 25m', price: 3800, seats: 40 },

  // Ahmedabad ↔ Delhi
  { airline: 'SpiceJet', from: 'Ahmedabad', to: 'Delhi', date: '2026-05-20', time: '06:30', duration: '2h 00m', price: 3200, seats: 50 },
  { airline: 'IndiGo', from: 'Ahmedabad', to: 'Delhi', date: '2026-05-22', time: '10:00', duration: '2h 00m', price: 3500, seats: 48 },

  // Kolkata ↔ Chennai
  { airline: 'Air India', from: 'Kolkata', to: 'Chennai', date: '2026-05-20', time: '08:00', duration: '2h 30m', price: 4200, seats: 45 },
  { airline: 'SpiceJet', from: 'Kolkata', to: 'Chennai', date: '2026-05-21', time: '12:00', duration: '2h 30m', price: 4100, seats: 50 },

  // Return flights
  { airline: 'IndiGo', from: 'Mumbai', to: 'Delhi', date: '2026-05-22', time: '16:00', duration: '2h 15m', price: 3400, seats: 50 },
  { airline: 'SpiceJet', from: 'Bangalore', to: 'Delhi', date: '2026-05-22', time: '11:00', duration: '2h 45m', price: 3600, seats: 50 },
  { airline: 'Vistara', from: 'Hyderabad', to: 'Bangalore', date: '2026-05-22', time: '09:00', duration: '1h 20m', price: 3000, seats: 38 },
  { airline: 'Air India', from: 'Hyderabad', to: 'Chennai', date: '2026-05-22', time: '15:30', duration: '1h 15m', price: 2800, seats: 42 },
  { airline: 'IndiGo', from: 'Hyderabad', to: 'Mumbai', date: '2026-05-22', time: '20:00', duration: '1h 10m', price: 2700, seats: 46 },
  { airline: 'SpiceJet', from: 'Chennai', to: 'Delhi', date: '2026-05-22', time: '06:00', duration: '3h 00m', price: 4800, seats: 50 },
  { airline: 'Air India', from: 'Mumbai', to: 'Pune', date: '2026-05-22', time: '17:30', duration: '55m', price: 2300, seats: 48 },
  { airline: 'IndiGo', from: 'Pune', to: 'Bangalore', date: '2026-05-22', time: '13:00', duration: '1h 25m', price: 3200, seats: 50 },
  { airline: 'SpiceJet', from: 'Delhi', to: 'Ahmedabad', date: '2026-05-22', time: '18:00', duration: '2h 00m', price: 3300, seats: 48 },
  { airline: 'Vistara', from: 'Chennai', to: 'Kolkata', date: '2026-05-22', time: '10:30', duration: '2h 30m', price: 4300, seats: 40 },

  // Additional routes to reach 40 flights
  { airline: 'IndiGo', from: 'Mumbai', to: 'Delhi', date: '2026-05-20', time: '06:45', duration: '2h 10m', price: 3600, seats: 50 },
  { airline: 'Air India', from: 'Delhi', to: 'Bangalore', date: '2026-05-22', time: '12:30', duration: '2h 50m', price: 4100, seats: 44 },
  { airline: 'Vistara', from: 'Bangalore', to: 'Mumbai', date: '2026-05-22', time: '19:00', duration: '1h 45m', price: 3300, seats: 36 },
  { airline: 'SpiceJet', from: 'Hyderabad', to: 'Delhi', date: '2026-05-21', time: '07:15', duration: '2h 10m', price: 3900, seats: 48 },
  { airline: 'IndiGo', from: 'Chennai', to: 'Mumbai', date: '2026-05-21', time: '17:15', duration: '1h 55m', price: 3600, seats: 50 },
  { airline: 'Air India', from: 'Kolkata', to: 'Delhi', date: '2026-05-22', time: '14:20', duration: '2h 10m', price: 4400, seats: 42 }
];

const VENDORS = [
  { email: 'vendor@indigo.com', companyName: 'IndiGo Airlines', type: 'flight', password: 'password' },
  { email: 'vendor@taj.com', companyName: 'Taj Hotels', type: 'hotel', password: 'password' },
  { email: 'vendor@ola.com', companyName: 'Ola Cabs', type: 'cab', password: 'password' }
];

const HOTELS = [
  { name: 'Taj Lake Palace', city: 'Mumbai', price: 5500, rating: 5, amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant'] },
  { name: 'ITC Grand Chola', city: 'Chennai', price: 4200, rating: 5, amenities: ['WiFi', 'Gym', 'Restaurant', 'Spa'] },
  { name: 'Park Hyatt', city: 'Bangalore', price: 6800, rating: 5, amenities: ['WiFi', 'Pool', 'Gym', 'Restaurant'] },
  { name: 'Oberoi Delhi', city: 'Delhi', price: 5000, rating: 5, amenities: ['WiFi', 'Restaurant', 'Spa', 'Pool'] },
  { name: 'Radisson Blu', city: 'Hyderabad', price: 3800, rating: 4, amenities: ['WiFi', 'Gym', 'Restaurant', 'Business Center'] }
];

const CABS = [
  { type: 'Sedan', from: 'Delhi', to: 'Delhi Airport', price: 800, capacity: 4, ac: true },
  { type: 'SUV', from: 'Mumbai', to: 'Mumbai Airport', price: 1200, capacity: 6, ac: true },
  { type: 'Mini', from: 'Bangalore', to: 'Bangalore Airport', price: 600, capacity: 4, ac: true },
  { type: 'Sedan', from: 'Chennai', to: 'Chennai Airport', price: 900, capacity: 4, ac: true },
  { type: 'SUV', from: 'Hyderabad', to: 'Hyderabad Airport', price: 1100, capacity: 6, ac: true }
];

const seedDatabase = async () => {
  try {
    console.log('\n🌱 Starting database seed...\n');
    
    await connectDB();

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Flight.deleteMany({}),
      Hotel.deleteMany({}),
      Cab.deleteMany({})
    ]);
    console.log('✅ Cleared existing data');

    // Create vendors
    const vendorDocs = [];
    for (const vendor of VENDORS) {
      const hashedPassword = await bcrypt.hash(vendor.password, 10);
      const vendorDoc = await User.create({
        email: vendor.email,
        companyName: vendor.companyName,
        type: vendor.type,
        role: 'vendor',
        password: hashedPassword,
        verified: true
      });
      vendorDocs.push(vendorDoc);
    }
    console.log(`✅ Created ${vendorDocs.length} vendors`);

    // Create flights
    const flightDocs = [];
    for (const flight of FLIGHT_DATA) {
      const doc = await Flight.create({
        vendorId: vendorDocs[0]._id, // All flights from IndiGo vendor
        ...flight
      });
      flightDocs.push(doc);
    }
    console.log(`✅ Created ${flightDocs.length} flights`);

    // Create hotels
    const hotelDocs = [];
    for (const hotel of HOTELS) {
      const doc = await Hotel.create({
        vendorId: vendorDocs[1]._id, // All hotels from Taj vendor
        roomType: 'Deluxe',
        ...hotel
      });
      hotelDocs.push(doc);
    }
    console.log(`✅ Created ${hotelDocs.length} hotels`);

    // Create cabs
    const cabDocs = [];
    for (const cab of CABS) {
      const doc = await Cab.create({
        vendorId: vendorDocs[2]._id, // All cabs from Ola vendor
        eta: '5-10 mins',
        ...cab
      });
      cabDocs.push(doc);
    }
    console.log(`✅ Created ${cabDocs.length} cabs`);

    console.log('\n✅ Database seeded successfully!\n');
    console.log('Vendor Credentials:');
    console.log('  Flight: vendor@indigo.com / password');
    console.log('  Hotel:  vendor@taj.com / password');
    console.log('  Cab:    vendor@ola.com / password\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedDatabase();
