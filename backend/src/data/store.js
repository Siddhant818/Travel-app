// In-memory mock data store
const { v4: uuidv4 } = require('uuid');

const store = {
  customers: [],
  vendors: [
    {
      id: 'v1',
      name: 'IndiGo Airlines',
      email: 'vendor@indigo.com',
      password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
      type: 'flight',
      companyName: 'IndiGo Airlines',
      verified: true
    },
    {
      id: 'v2',
      name: 'Taj Hotels',
      email: 'vendor@taj.com',
      password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
      type: 'hotel',
      companyName: 'Taj Hotels & Resorts',
      verified: true
    },
    {
      id: 'v3',
      name: 'Ola Cabs',
      email: 'vendor@ola.com',
      password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
      type: 'cab',
      companyName: 'Ola Cabs India',
      verified: true
    }
  ],
  otps: {}, // email -> { otp, expiry, userData }
  bookings: [],
  messages: {}, // bookingId -> [{sender, text, time}]

  // Mock listings
  flights: [
    // Delhi <-> Mumbai
    { id: 'f1', vendorId: 'v1', from: 'Delhi', to: 'Mumbai', date: '2026-05-20', time: '06:00', duration: '2h 10m', price: 4500, airline: 'IndiGo', seats: 45, class: 'Economy' },
    { id: 'f2', vendorId: 'v1', from: 'Delhi', to: 'Mumbai', date: '2026-05-20', time: '11:30', duration: '2h 05m', price: 5200, airline: 'SpiceJet', seats: 20, class: 'Economy' },
    { id: 'f3', vendorId: 'v1', from: 'Delhi', to: 'Mumbai', date: '2026-05-21', time: '14:00', duration: '2h 15m', price: 4800, airline: 'Air India', seats: 30, class: 'Business' },
    { id: 'f4', vendorId: 'v1', from: 'Delhi', to: 'Mumbai', date: '2026-05-22', time: '09:00', duration: '2h 10m', price: 5500, airline: 'Vistara', seats: 15, class: 'Economy' },
    { id: 'f5', vendorId: 'v1', from: 'Mumbai', to: 'Delhi', date: '2026-05-20', time: '07:15', duration: '2h 20m', price: 4700, airline: 'IndiGo', seats: 50, class: 'Economy' },
    { id: 'f6', vendorId: 'v1', from: 'Mumbai', to: 'Delhi', date: '2026-05-21', time: '12:00', duration: '2h 05m', price: 5400, airline: 'SpiceJet', seats: 25, class: 'Economy' },
    
    // Delhi <-> Bangalore
    { id: 'f7', vendorId: 'v1', from: 'Delhi', to: 'Bangalore', date: '2026-05-20', time: '08:00', duration: '2h 45m', price: 5800, airline: 'IndiGo', seats: 30, class: 'Economy' },
    { id: 'f8', vendorId: 'v1', from: 'Delhi', to: 'Bangalore', date: '2026-05-21', time: '10:30', duration: '2h 40m', price: 6200, airline: 'Air India', seats: 20, class: 'Business' },
    { id: 'f9', vendorId: 'v1', from: 'Delhi', to: 'Bangalore', date: '2026-05-22', time: '15:00', duration: '2h 45m', price: 5600, airline: 'Vistara', seats: 40, class: 'Economy' },
    { id: 'f10', vendorId: 'v1', from: 'Bangalore', to: 'Delhi', date: '2026-05-20', time: '06:30', duration: '2h 50m', price: 5900, airline: 'SpiceJet', seats: 35, class: 'Economy' },
    
    // Mumbai <-> Bangalore
    { id: 'f11', vendorId: 'v1', from: 'Mumbai', to: 'Bangalore', date: '2026-05-20', time: '07:00', duration: '1h 45m', price: 3800, airline: 'IndiGo', seats: 45, class: 'Economy' },
    { id: 'f12', vendorId: 'v1', from: 'Mumbai', to: 'Bangalore', date: '2026-05-21', time: '13:00', duration: '1h 50m', price: 4200, airline: 'SpiceJet', seats: 30, class: 'Economy' },
    { id: 'f13', vendorId: 'v1', from: 'Bangalore', to: 'Mumbai', date: '2026-05-20', time: '09:00', duration: '1h 45m', price: 3900, airline: 'Air India', seats: 25, class: 'Economy' },
    
    // Bangalore <-> Hyderabad
    { id: 'f14', vendorId: 'v1', from: 'Bangalore', to: 'Hyderabad', date: '2026-05-20', time: '09:30', duration: '1h 20m', price: 3200, airline: 'IndiGo', seats: 50, class: 'Economy' },
    { id: 'f15', vendorId: 'v1', from: 'Bangalore', to: 'Hyderabad', date: '2026-05-21', time: '14:30', duration: '1h 25m', price: 3500, airline: 'SpiceJet', seats: 35, class: 'Economy' },
    { id: 'f16', vendorId: 'v1', from: 'Hyderabad', to: 'Bangalore', date: '2026-05-20', time: '11:00', duration: '1h 20m', price: 3300, airline: 'Vistara', seats: 40, class: 'Economy' },
    
    // Delhi <-> Kolkata
    { id: 'f17', vendorId: 'v1', from: 'Delhi', to: 'Kolkata', date: '2026-05-20', time: '07:00', duration: '2h 30m', price: 4200, airline: 'IndiGo', seats: 40, class: 'Economy' },
    { id: 'f18', vendorId: 'v1', from: 'Delhi', to: 'Kolkata', date: '2026-05-21', time: '12:30', duration: '2h 35m', price: 4600, airline: 'Air India', seats: 20, class: 'Business' },
    { id: 'f19', vendorId: 'v1', from: 'Kolkata', to: 'Delhi', date: '2026-05-20', time: '10:00', duration: '2h 30m', price: 4300, airline: 'SpiceJet', seats: 45, class: 'Economy' },
    
    // Chennai <-> Hyderabad
    { id: 'f20', vendorId: 'v1', from: 'Chennai', to: 'Hyderabad', date: '2026-05-20', time: '08:00', duration: '1h 30m', price: 2800, airline: 'IndiGo', seats: 50, class: 'Economy' },
    { id: 'f21', vendorId: 'v1', from: 'Chennai', to: 'Hyderabad', date: '2026-05-21', time: '13:00', duration: '1h 35m', price: 3100, airline: 'SpiceJet', seats: 30, class: 'Economy' },
    { id: 'f22', vendorId: 'v1', from: 'Hyderabad', to: 'Chennai', date: '2026-05-20', time: '10:30', duration: '1h 30m', price: 2900, airline: 'Vistara', seats: 40, class: 'Economy' },
    
    // Mumbai <-> Hyderabad
    { id: 'f23', vendorId: 'v1', from: 'Mumbai', to: 'Hyderabad', date: '2026-05-20', time: '06:30', duration: '1h 40m', price: 3400, airline: 'IndiGo', seats: 45, class: 'Economy' },
    { id: 'f24', vendorId: 'v1', from: 'Mumbai', to: 'Hyderabad', date: '2026-05-21', time: '12:00', duration: '1h 45m', price: 3800, airline: 'Air India', seats: 25, class: 'Economy' },
    { id: 'f25', vendorId: 'v1', from: 'Hyderabad', to: 'Mumbai', date: '2026-05-20', time: '09:00', duration: '1h 40m', price: 3500, airline: 'SpiceJet', seats: 35, class: 'Economy' },
    
    // Delhi <-> Chennai
    { id: 'f26', vendorId: 'v1', from: 'Delhi', to: 'Chennai', date: '2026-05-20', time: '06:00', duration: '3h 10m', price: 6500, airline: 'Air India', seats: 30, class: 'Economy' },
    { id: 'f27', vendorId: 'v1', from: 'Delhi', to: 'Chennai', date: '2026-05-21', time: '11:00', duration: '3h 15m', price: 6800, airline: 'Vistara', seats: 20, class: 'Business' },
    { id: 'f28', vendorId: 'v1', from: 'Chennai', to: 'Delhi', date: '2026-05-20', time: '08:30', duration: '3h 10m', price: 6600, airline: 'IndiGo', seats: 40, class: 'Economy' },
    
    // Pune <-> Mumbai
    { id: 'f29', vendorId: 'v1', from: 'Pune', to: 'Mumbai', date: '2026-05-20', time: '07:00', duration: '0h 55m', price: 2200, airline: 'IndiGo', seats: 50, class: 'Economy' },
    { id: 'f30', vendorId: 'v1', from: 'Pune', to: 'Mumbai', date: '2026-05-21', time: '14:00', duration: '1h 00m', price: 2400, airline: 'SpiceJet', seats: 35, class: 'Economy' },
    { id: 'f31', vendorId: 'v1', from: 'Mumbai', to: 'Pune', date: '2026-05-20', time: '09:30', duration: '0h 55m', price: 2300, airline: 'Vistara', seats: 40, class: 'Economy' },
    
    // Bangalore <-> Pune
    { id: 'f32', vendorId: 'v1', from: 'Bangalore', to: 'Pune', date: '2026-05-20', time: '10:00', duration: '1h 35m', price: 3100, airline: 'IndiGo', seats: 45, class: 'Economy' },
    { id: 'f33', vendorId: 'v1', from: 'Bangalore', to: 'Pune', date: '2026-05-21', time: '15:00', duration: '1h 40m', price: 3400, airline: 'Air India', seats: 25, class: 'Economy' },
    { id: 'f34', vendorId: 'v1', from: 'Pune', to: 'Bangalore', date: '2026-05-20', time: '08:00', duration: '1h 35m', price: 3200, airline: 'SpiceJet', seats: 40, class: 'Economy' },
    
    // Ahmedabad <-> Delhi
    { id: 'f35', vendorId: 'v1', from: 'Ahmedabad', to: 'Delhi', date: '2026-05-20', time: '07:30', duration: '1h 50m', price: 3600, airline: 'IndiGo', seats: 50, class: 'Economy' },
    { id: 'f36', vendorId: 'v1', from: 'Ahmedabad', to: 'Delhi', date: '2026-05-21', time: '13:00', duration: '1h 50m', price: 3900, airline: 'SpiceJet', seats: 30, class: 'Economy' },
    { id: 'f37', vendorId: 'v1', from: 'Delhi', to: 'Ahmedabad', date: '2026-05-20', time: '10:00', duration: '1h 50m', price: 3700, airline: 'Vistara', seats: 40, class: 'Economy' },
    
    // Kolkata <-> Chennai
    { id: 'f38', vendorId: 'v1', from: 'Kolkata', to: 'Chennai', date: '2026-05-20', time: '06:00', duration: '2h 45m', price: 4800, airline: 'Air India', seats: 35, class: 'Economy' },
    { id: 'f39', vendorId: 'v1', from: 'Kolkata', to: 'Chennai', date: '2026-05-21', time: '11:30', duration: '2h 50m', price: 5100, airline: 'IndiGo', seats: 25, class: 'Economy' },
    { id: 'f40', vendorId: 'v1', from: 'Chennai', to: 'Kolkata', date: '2026-05-20', time: '09:00', duration: '2h 45m', price: 4900, airline: 'SpiceJet', seats: 40, class: 'Economy' },
  ],
  hotels: [
    { id: 'h1', vendorId: 'v2', name: 'Taj Mahal Palace', city: 'Mumbai', rating: 5, price: 12000, amenities: ['Pool', 'Spa', 'WiFi', 'Restaurant'], image: 'luxury', roomType: 'Deluxe Suite' },
    { id: 'h2', vendorId: 'v2', name: 'Taj Bengal', city: 'Kolkata', rating: 5, price: 9500, amenities: ['Pool', 'Gym', 'WiFi', 'Bar'], image: 'premium', roomType: 'Superior Room' },
    { id: 'h3', vendorId: 'v2', name: 'Vivanta Delhi', city: 'Delhi', rating: 4, price: 7200, amenities: ['WiFi', 'Restaurant', 'Gym'], image: 'modern', roomType: 'Premium Room' },
    { id: 'h4', vendorId: 'v2', name: 'Taj Coromandel', city: 'Chennai', rating: 5, price: 10500, amenities: ['Pool', 'Spa', 'WiFi', 'Restaurant'], image: 'luxury', roomType: 'Club Room' },
  ],
  cabs: [
    { id: 'c1', vendorId: 'v3', type: 'Mini', from: 'Delhi Airport', to: 'Connaught Place', price: 350, eta: '8 mins', capacity: 4, ac: true },
    { id: 'c2', vendorId: 'v3', type: 'Sedan', from: 'Delhi Airport', to: 'Connaught Place', price: 520, eta: '5 mins', capacity: 4, ac: true },
    { id: 'c3', vendorId: 'v3', type: 'SUV', from: 'Mumbai Airport', to: 'Bandra', price: 750, eta: '3 mins', capacity: 6, ac: true },
    { id: 'c4', vendorId: 'v3', type: 'Mini', from: 'Bangalore Airport', to: 'MG Road', price: 420, eta: '10 mins', capacity: 4, ac: true },
  ]
};

module.exports = store;
