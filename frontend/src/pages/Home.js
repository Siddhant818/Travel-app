import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const TABS = [
  { key: 'flights', label: 'Flights', icon: 'FL' },
  { key: 'hotels', label: 'Hotels', icon: 'HT' },
  { key: 'cabs', label: 'Cabs', icon: 'CB' },
];

const CITIES = ['Delhi', 'Mumbai', 'Bangalore', 'Kolkata', 'Chennai', 'Hyderabad', 'Pune', 'Ahmedabad'];

export default function Home() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('flights');
  const [flightSearchError, setFlightSearchError] = useState('');
  const [hotelSearchError, setHotelSearchError] = useState('');

  // Flight form
  const [flightFrom, setFlightFrom] = useState('');
  const [flightTo, setFlightTo] = useState('');
  const [flightDate, setFlightDate] = useState('');

  // Hotel form
  const [hotelCity, setHotelCity] = useState('');
  const [hotelCheckInDate, setHotelCheckInDate] = useState('');
  const [hotelCheckInTime, setHotelCheckInTime] = useState('');
  const [hotelCheckOutDate, setHotelCheckOutDate] = useState('');
  const [hotelCheckOutTime, setHotelCheckOutTime] = useState('');

  // Cab form
  const [cabFrom, setCabFrom] = useState('');

  const handleFlightSearch = (e) => {
    e.preventDefault();
    if (!flightFrom.trim() || !flightTo.trim() || !flightDate.trim()) {
      setFlightSearchError('Please select from, to, and date before searching flights.');
      return;
    }
    setFlightSearchError('');
    navigate(`/search/flights?from=${flightFrom}&to=${flightTo}&date=${flightDate}`);
  };

  const handleHotelSearch = (e) => {
    e.preventDefault();
    if (!hotelCity.trim() || !hotelCheckInDate.trim() || !hotelCheckInTime.trim() || !hotelCheckOutDate.trim() || !hotelCheckOutTime.trim()) {
      setHotelSearchError('Please select city, check-in, and check-out date/time before searching hotels.');
      return;
    }

    const checkIn = new Date(`${hotelCheckInDate}T${hotelCheckInTime}`);
    const checkOut = new Date(`${hotelCheckOutDate}T${hotelCheckOutTime}`);
    if (Number.isNaN(checkIn.getTime()) || Number.isNaN(checkOut.getTime()) || checkOut <= checkIn) {
      setHotelSearchError('Check-out must be after check-in.');
      return;
    }

    setHotelSearchError('');
    navigate(`/search/hotels?city=${hotelCity}&checkInDate=${hotelCheckInDate}&checkInTime=${hotelCheckInTime}&checkOutDate=${hotelCheckOutDate}&checkOutTime=${hotelCheckOutTime}`);
  };

  const handleCabSearch = (e) => {
    e.preventDefault();
    navigate(`/search/cabs?from=${cabFrom}`);
  };

  return (
    <div>
      <Navbar />

      {/* HERO */}
      <div className="hero fade-in">
        <h1 className="hero-title">Travel Smart, Travel Happy</h1>
        <p className="hero-sub">Flights • Hotels • Cabs — all in one place</p>

        <div className="search-card">
          <div className="tab-row">
            {TABS.map(t => (
              <button
                key={t.key}
                className={`tab-btn ${activeTab === t.key ? 'active' : ''}`}
                onClick={() => setActiveTab(t.key)}
              >
                <span className="tab-icon">{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>

          <div className="search-form">
            {activeTab === 'flights' && (
              <form onSubmit={handleFlightSearch}>
                <div className="search-row cols-3">
                  <div className="field-group">
                    <label className="field-label">From</label>
                    <select
                      className="field-input"
                      value={flightFrom}
                      onChange={e => setFlightFrom(e.target.value)}
                    >
                      <option value="">Select departure</option>
                      {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="field-group">
                    <label className="field-label">To</label>
                    <select
                      className="field-input"
                      value={flightTo}
                      onChange={e => setFlightTo(e.target.value)}
                    >
                      <option value="">Select destination</option>
                      {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="field-group">
                    <label className="field-label">Date</label>
                    <input
                      className="field-input"
                      type="date"
                      value={flightDate}
                      onChange={e => setFlightDate(e.target.value)}
                    />
                  </div>
                </div>
                <button type="submit" className="search-btn" disabled={!flightFrom.trim() || !flightTo.trim() || !flightDate.trim()}>Search Flights</button>
                {flightSearchError && <div className="error-msg" style={{ marginTop: 12, marginBottom: 0 }}>{flightSearchError}</div>}
              </form>
            )}

            {activeTab === 'hotels' && (
              <form onSubmit={handleHotelSearch}>
                <div className="search-row cols-3">
                  <div className="field-group">
                    <label className="field-label">City</label>
                    <input
                      className="field-input"
                      placeholder="e.g. Mumbai, Delhi, Kolkata..."
                      value={hotelCity}
                      onChange={e => setHotelCity(e.target.value)}
                      list="hotel-cities"
                    />
                    <datalist id="hotel-cities">
                      {CITIES.map(c => <option key={c} value={c} />)}
                    </datalist>
                  </div>
                  <div className="field-group">
                    <label className="field-label">Check-in Date</label>
                    <input
                      className="field-input"
                      type="date"
                      value={hotelCheckInDate}
                      onChange={e => setHotelCheckInDate(e.target.value)}
                    />
                  </div>
                  <div className="field-group">
                    <label className="field-label">Check-in Time</label>
                    <input
                      className="field-input"
                      type="time"
                      value={hotelCheckInTime}
                      onChange={e => setHotelCheckInTime(e.target.value)}
                    />
                  </div>
                  <div className="field-group">
                    <label className="field-label">Check-out Date</label>
                    <input
                      className="field-input"
                      type="date"
                      value={hotelCheckOutDate}
                      onChange={e => setHotelCheckOutDate(e.target.value)}
                    />
                  </div>
                  <div className="field-group">
                    <label className="field-label">Check-out Time</label>
                    <input
                      className="field-input"
                      type="time"
                      value={hotelCheckOutTime}
                      onChange={e => setHotelCheckOutTime(e.target.value)}
                    />
                  </div>
                </div>
                <button type="submit" className="search-btn">Search Hotels</button>
                {hotelSearchError && <div className="error-msg" style={{ marginTop: 12, marginBottom: 0 }}>{hotelSearchError}</div>}
              </form>
            )}

            {activeTab === 'cabs' && (
              <form onSubmit={handleCabSearch}>
                <div className="search-row cols-1">
                  <div className="field-group">
                    <label className="field-label">Pickup Location</label>
                    <input
                      className="field-input"
                      placeholder="e.g. Delhi Airport, Mumbai Airport..."
                      value={cabFrom}
                      onChange={e => setCabFrom(e.target.value)}
                    />
                  </div>
                </div>
                <button type="submit" className="search-btn">Find Cabs</button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '60px 24px' }}>
        <h2 style={{ textAlign: 'center', fontSize: 26, fontWeight: 800, marginBottom: 8 }}>Why TravelApp?</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: 40, fontSize: 15 }}>
          Everything you need for the perfect trip
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
          {[
            { icon: '₹', title: 'Best Prices', desc: 'Competitive fares across all travel categories' },
            { icon: '⚡', title: 'Instant Booking', desc: 'Confirm your booking in seconds, no hassle' },
            { icon: '✓', title: 'Secure & Safe', desc: 'Your data and payments are always protected' },
            { icon: '☎', title: '24/7 Support', desc: 'Round-the-clock assistance whenever you need' },
          ].map(f => (
            <div key={f.title} style={{
              background: '#fff', borderRadius: 16, padding: 28, textAlign: 'center',
              boxShadow: 'var(--shadow)', transition: 'all 0.2s'
            }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>{f.icon}</div>
              <div style={{ fontWeight: 700, marginBottom: 6, fontSize: 16 }}>{f.title}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* POPULAR ROUTES */}
      <div style={{ background: '#fff', padding: '60px 24px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>✈️ Popular Routes</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            {[
              { from: 'Delhi', to: 'Mumbai', price: '₹4,500' },
              { from: 'Mumbai', to: 'Goa', price: '₹3,200' },
              { from: 'Bangalore', to: 'Hyderabad', price: '₹2,800' },
              { from: 'Delhi', to: 'Bangalore', price: '₹5,800' },
            ].map(r => (
              <div
                key={r.from + r.to}
                style={{
                  background: 'linear-gradient(135deg, #EEF7FF, #F5F0FF)',
                  borderRadius: 14, padding: '18px 20px', cursor: 'pointer',
                  transition: 'all 0.2s', border: '1px solid transparent'
                }}
                onClick={() => navigate(`/search/flights?from=${r.from}&to=${r.to}`)}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'transparent'}
              >
                <div style={{ fontWeight: 700, fontSize: 15 }}>{r.from} → {r.to}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 4 }}>Starting from</div>
                <div style={{ color: 'var(--accent)', fontWeight: 800, fontSize: 18, marginTop: 2 }}>{r.price}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer style={{ textAlign: 'center', padding: '30px 20px', color: 'var(--text-muted)', fontSize: 13, borderTop: '1px solid var(--border)' }}>
        © 2024 TravelApp. All rights reserved.
      </footer>
    </div>
  );
}
