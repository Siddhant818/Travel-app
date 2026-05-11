import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Toast from '../components/Toast';
import FlightCard from '../components/FlightCard';
import HotelCard from '../components/HotelCard';
import CabCard from '../components/CabCard';
import ConfirmModal from '../components/ConfirmModal';
import api from '../utils/api';

function formatPrice(p) {
  return '₹' + p.toLocaleString('en-IN');
}


export default function SearchResults() {
  const { type } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'info' });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [sortBy, setSortBy] = useState('price');
  const [priceFilter, setPriceFilter] = useState('all');
  const [searchError, setSearchError] = useState('');
  
  // Editable search fields
  const [searchFrom, setSearchFrom] = useState(searchParams.get('from') || '');
  const [searchTo, setSearchTo] = useState(searchParams.get('to') || searchParams.get('city') || '');
  const [searchDate, setSearchDate] = useState(searchParams.get('date') || '');
  const [hotelCheckInDate, setHotelCheckInDate] = useState(searchParams.get('checkInDate') || '');
  const [hotelCheckInTime, setHotelCheckInTime] = useState(searchParams.get('checkInTime') || '');
  const [hotelCheckOutDate, setHotelCheckOutDate] = useState(searchParams.get('checkOutDate') || '');
  const [hotelCheckOutTime, setHotelCheckOutTime] = useState(searchParams.get('checkOutTime') || '');

  const CITIES = ['Delhi', 'Mumbai', 'Bangalore', 'Kolkata', 'Chennai', 'Hyderabad', 'Pune', 'Ahmedabad'];
  const today = new Date().toISOString().split('T')[0];
  const canSearchFlights = type !== 'flights' || (searchFrom.trim() && searchTo.trim() && searchDate.trim());

  const airlineFilters = ['all', ...new Set(results.map(flight => flight.airline).filter(Boolean))];

  useEffect(() => {
    if (type === 'flights' && !canSearchFlights) {
      setResults([]);
      setLoading(false);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      try {
        const params = Object.fromEntries(searchParams);
        const res = await api.get(`/search/${type}`, { params });
        setResults(res.data);
      } catch {}
      setLoading(false);
    };
    fetchResults();
  }, [type, searchParams, canSearchFlights]);

  const handleUpdateSearch = () => {
    if (type === 'flights' && (!searchFrom.trim() || !searchTo.trim() || !searchDate.trim())) {
      setSearchError('Select from, to, and date before searching flights.');
      setResults([]);
      return;
    }

    if (type === 'hotels') {
      if (!searchFrom.trim() || !hotelCheckInDate.trim() || !hotelCheckInTime.trim() || !hotelCheckOutDate.trim() || !hotelCheckOutTime.trim()) {
        setSearchError('Select city, check-in, and check-out date/time before searching hotels.');
        setResults([]);
        return;
      }

      const checkIn = new Date(`${hotelCheckInDate}T${hotelCheckInTime}`);
      const checkOut = new Date(`${hotelCheckOutDate}T${hotelCheckOutTime}`);
      if (Number.isNaN(checkIn.getTime()) || Number.isNaN(checkOut.getTime()) || checkOut <= checkIn) {
        setSearchError('Check-out must be after check-in.');
        setResults([]);
        return;
      }
    }

    setSearchError('');
    const newParams = new URLSearchParams();
    if (searchFrom) newParams.set(type === 'hotels' ? 'city' : 'from', searchFrom);
    if (searchTo && type !== 'hotels') newParams.set(type === 'cabs' ? 'from' : 'to', searchTo);
    if (searchDate) newParams.set('date', searchDate);
    if (type === 'hotels') {
      if (hotelCheckInDate) newParams.set('checkInDate', hotelCheckInDate);
      if (hotelCheckInTime) newParams.set('checkInTime', hotelCheckInTime);
      if (hotelCheckOutDate) newParams.set('checkOutDate', hotelCheckOutDate);
      if (hotelCheckOutTime) newParams.set('checkOutTime', hotelCheckOutTime);
    }
    setSearchParams(newParams);
  };

  const handleRouteClick = (from, to) => {
    setSearchFrom(from);
    setSearchTo(to);
    setSearchError('');
    const newParams = new URLSearchParams();
    newParams.set('from', from);
    newParams.set(type === 'hotels' ? 'city' : 'to', to);
    if (searchDate) newParams.set('date', searchDate);
    setSearchParams(newParams);
  };

  const handleBook = async (service) => {
    if (!user) {
      navigate('/login/customer');
      return;
    }
    setBookingLoading(true);
    try {
      await api.post('/bookings', {
        serviceType: type === 'flights' ? 'flight' : type === 'hotels' ? 'hotel' : 'cab',
        serviceId: service.id,
        details: { date: searchParams.get('date'), passengers: 1 }
      });
      setBookingSuccess(true);
      setToast({ message: 'Booking confirmed — redirecting to your dashboard', type: 'success' });
      setTimeout(() => { setBookingSuccess(false); navigate('/customer/dashboard'); }, 1600);
    } catch (e) {
      const msg = e.response?.data?.error || 'Booking failed';
      setToast({ message: msg, type: 'error' });
    }
    setBookingLoading(false);
  };

  const handleStartBooking = (service) => {
    setSelectedService(service);
    setConfirmOpen(true);
  };

  const confirmBooking = async () => {
    setConfirmOpen(false);
    if (!selectedService) return;
    await handleBook(selectedService);
    setSelectedService(null);
  };

  // Popular routes mock data
  const popularRoutes = [
    { from: 'DEL', to: 'BOM', price: 3500 },
    { from: 'DEL', to: 'BLR', price: 4200 },
    { from: 'BOM', to: 'HYD', price: 2800 },
    { from: 'CCU', to: 'DEL', price: 3900 },
    { from: 'BOM', to: 'CCU', price: 3200 },
    { from: 'BLR', to: 'CCU', price: 4100 },
  ];

  // Sort and filter results
  const filteredResults = type === 'flights' && priceFilter !== 'all'
    ? results.filter(flight => flight.airline === priceFilter)
    : results;

  const sortedResults = [...filteredResults].sort((a, b) => {
    if (sortBy === 'price') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    return 0;
  });

  const icons = { flights: 'Flights', hotels: 'Hotels', cabs: 'Cabs' };
  const title = type?.charAt(0).toUpperCase() + type?.slice(1);
  const hotelStayLabel = type === 'hotels' && hotelCheckInDate && hotelCheckInTime && hotelCheckOutDate && hotelCheckOutTime
    ? `${hotelCheckInDate} ${hotelCheckInTime} → ${hotelCheckOutDate} ${hotelCheckOutTime}`
    : '';

  return (
    <div>
      <Navbar />
      <div className="page fade-in">
        <div className="results-header fade-in">
          <h2>{title} Results</h2>
          <p>{type === 'flights' && !canSearchFlights ? 'Choose from, to, and date to see flight results' : type === 'hotels' && hotelStayLabel ? `${results.length} results found for ${searchFrom}` : `${results.length} results found ${searchParams.get('from') ? `for "${searchParams.get('from')}"` : ''}`}</p>
        </div>

        {/* Editable Search Bar */}
        <div style={{ background: '#fff', borderRadius: 'var(--radius)', padding: '20px 24px', marginBottom: 24, boxShadow: 'var(--shadow)', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
            {(type === 'flights' || type === 'hotels' || type === 'cabs') && (
              <>
                <div className="field-group" style={{ flex: '1 1 150px' }}>
                  <label className="field-label">{type === 'flights' ? 'From' : type === 'hotels' ? 'City' : 'Pickup'}</label>
                  {type === 'flights' ? (
                    <select className="field-input" value={searchFrom} onChange={e => setSearchFrom(e.target.value)}>
                      <option value="">Select departure</option>
                      {CITIES.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  ) : (
                    <input className="field-input" placeholder="Enter location" value={searchFrom} onChange={e => setSearchFrom(e.target.value)} />
                  )}
                </div>
                {type === 'hotels' && (
                  <>
                    <div className="field-group" style={{ flex: '1 1 150px' }}>
                      <label className="field-label">Check-in Date</label>
                      <input className="field-input" type="date" min={today} value={hotelCheckInDate} onChange={e => setHotelCheckInDate(e.target.value)} />
                    </div>
                    <div className="field-group" style={{ flex: '1 1 150px' }}>
                      <label className="field-label">Check-in Time</label>
                      <input className="field-input" type="time" value={hotelCheckInTime} onChange={e => setHotelCheckInTime(e.target.value)} />
                    </div>
                    <div className="field-group" style={{ flex: '1 1 150px' }}>
                      <label className="field-label">Check-out Date</label>
                      <input className="field-input" type="date" min={today} value={hotelCheckOutDate} onChange={e => setHotelCheckOutDate(e.target.value)} />
                    </div>
                    <div className="field-group" style={{ flex: '1 1 150px' }}>
                      <label className="field-label">Check-out Time</label>
                      <input className="field-input" type="time" value={hotelCheckOutTime} onChange={e => setHotelCheckOutTime(e.target.value)} />
                    </div>
                  </>
                )}
                {type === 'flights' && (
                  <div className="field-group" style={{ flex: '1 1 150px' }}>
                    <label className="field-label">To</label>
                    <select className="field-input" value={searchTo} onChange={e => setSearchTo(e.target.value)}>
                      <option value="">Select destination</option>
                      {CITIES.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                )}
                {type === 'cabs' && (
                  <div className="field-group" style={{ flex: '1 1 150px' }}>
                    <label className="field-label">Dropoff</label>
                    <input className="field-input" placeholder="Enter destination" value={searchTo} onChange={e => setSearchTo(e.target.value)} />
                  </div>
                )}
                {type === 'flights' && (
                  <div className="field-group" style={{ flex: '1 1 120px' }}>
                    <label className="field-label">Date</label>
                    <input className="field-input" type="date" min={today} value={searchDate} onChange={e => setSearchDate(e.target.value)} />
                  </div>
                )}
              </>
            )}
            <button
              className="search-btn"
              onClick={handleUpdateSearch}
              disabled={type === 'flights' && !canSearchFlights}
              style={{ padding: '12px 24px', height: 'fit-content', whiteSpace: 'nowrap', width: 'auto' }}
            >
              Update
            </button>
          </div>
          {searchError && <div className="error-msg" style={{ marginTop: 16, marginBottom: 0 }}>{searchError}</div>}
        </div>

        {bookingSuccess && (
          <div className="success-msg" style={{ marginBottom: 20 }}>
            Booking confirmed! Redirecting to your dashboard...
          </div>
        )}

        <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'info' })} />

        {!loading && results.length > 0 && (
          <>
            <div className="popular-routes">
              <div className="popular-title">Popular Routes</div>
              <div className="routes-grid">
                {popularRoutes.map((r, i) => {
                  const cityMap = { 'DEL': 'Delhi', 'BOM': 'Mumbai', 'BLR': 'Bangalore', 'CCU': 'Kolkata', 'HYD': 'Hyderabad', 'CHE': 'Chennai', 'PNQ': 'Pune' };
                  return (
                    <div 
                      key={i} 
                      className="route-card" 
                      onClick={() => handleRouteClick(cityMap[r.from], cityMap[r.to])}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="route-from">{r.from}</div>
                      <div className="route-arrow">→</div>
                      <div className="route-to">{r.to}</div>
                      <div className="route-price">From ₹{r.price}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="filters-bar">
              {airlineFilters.map(filter => (
                <button
                  key={filter}
                  type="button"
                  className={`filter-tag ${priceFilter === filter ? 'active' : ''}`}
                  onClick={() => setPriceFilter(filter)}
                >
                  {filter === 'all' ? 'All Airlines' : filter}
                </button>
              ))}
              <div className="sort-options">
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)' }}>Sort by:</label>
                <select className="sort-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                  <option value="price">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>
          </>
        )}

        {loading ? (
          <div className="card-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="result-card">
                <div style={{ display: 'flex', gap: 16 }}>
                  <div style={{ width: 54, height: 54, borderRadius: 12, background: '#eef2ff' }} className="skeleton" />
                  <div style={{ flex: 1 }}>
                    <div className="skeleton" style={{ height: 16, width: '60%', marginBottom: 10 }} />
                    <div className="skeleton" style={{ height: 12, width: '40%', marginBottom: 8 }} />
                    <div className="skeleton" style={{ height: 12, width: '30%' }} />
                  </div>
                  <div style={{ width: 120 }}>
                    <div className="skeleton" style={{ height: 20, width: '100%', marginBottom: 8 }} />
                    <div className="skeleton" style={{ height: 36, width: '100%', borderRadius: 8 }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : type === 'flights' && !canSearchFlights ? (
          <div className="empty-state">
            <div className="empty-icon">search</div>
            <h3>Search not ready</h3>
            <p>Pick departure, destination, and date to load flight results</p>
          </div>
        ) : results.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">search</div>
            <h3>No results found</h3>
            <p>Try different search criteria</p>
          </div>
        ) : (
          <div className="card-grid">
            {type === 'flights' && sortedResults.map(f => (
              <div key={f.id} className="result-card fade-in">
                <FlightCard flight={f} onBook={handleStartBooking} onSelect={s => setToast({ message: `Selected ${s.airline} — ${s.from} → ${s.to}`, type: 'info' })} />
              </div>
            ))}
            {type === 'hotels' && sortedResults.map(h => (
              <div key={h.id} className="result-card fade-in">
                <HotelCard
                  hotel={h}
                  stayDetails={{
                    checkInDate: hotelCheckInDate,
                    checkInTime: hotelCheckInTime,
                    checkOutDate: hotelCheckOutDate,
                    checkOutTime: hotelCheckOutTime,
                  }}
                  onBook={handleStartBooking}
                  onSelect={s => setToast({ message: `Selected ${s.name} — ${s.city}`, type: 'info' })}
                />
              </div>
            ))}
            {type === 'cabs' && sortedResults.map(c => (
              <div key={c.id} className="result-card fade-in">
                <CabCard cab={c} onBook={handleStartBooking} onSelect={s => setToast({ message: `Selected ${s.type} — ${s.from}`, type: 'info' })} />
              </div>
            ))}
          </div>
        )}
        <ConfirmModal
          open={confirmOpen}
          title="Confirm booking"
          body={selectedService ? (type === 'flights' ? `${selectedService.airline} ${selectedService.from} → ${selectedService.to} · ₹${selectedService.price}` : type === 'hotels' ? `${selectedService.name} · ${selectedService.city} · ₹${selectedService.price}${hotelStayLabel ? ` · ${hotelStayLabel}` : ''}` : `${selectedService.type} · ${selectedService.from} → ${selectedService.to} · ₹${selectedService.price}`) : ''}
          onCancel={() => setConfirmOpen(false)}
          onConfirm={confirmBooking}
          confirmLabel="Confirm & Pay"
        />
      </div>
      
    </div>
  );
}
