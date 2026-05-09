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
  
  // Editable search fields
  const [searchFrom, setSearchFrom] = useState(searchParams.get('from') || '');
  const [searchTo, setSearchTo] = useState(searchParams.get('to') || searchParams.get('city') || '');
  const [searchDate, setSearchDate] = useState(searchParams.get('date') || '');

  const CITIES = ['Delhi', 'Mumbai', 'Bangalore', 'Kolkata', 'Chennai', 'Hyderabad', 'Pune', 'Ahmedabad'];

  useEffect(() => {
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
  }, [type, searchParams]);

  const handleUpdateSearch = () => {
    const newParams = new URLSearchParams();
    if (searchFrom) newParams.set('from', searchFrom);
    if (searchTo) newParams.set(type === 'hotels' ? 'city' : type === 'cabs' ? 'from' : 'to', searchTo);
    if (searchDate) newParams.set('date', searchDate);
    setSearchParams(newParams);
  };

  const handleRouteClick = (from, to) => {
    setSearchFrom(from);
    setSearchTo(to);
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
  const sortedResults = [...results].sort((a, b) => {
    if (sortBy === 'price') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    return 0;
  });

  const icons = { flights: 'Flights', hotels: 'Hotels', cabs: 'Cabs' };
  const title = type?.charAt(0).toUpperCase() + type?.slice(1);

  return (
    <div>
      <Navbar />
      <div className="page fade-in">
        <div className="results-header fade-in">
          <h2>{title} Results</h2>
          <p>{results.length} results found {searchParams.get('from') ? `for "${searchParams.get('from')}"` : ''}</p>
        </div>

        {/* Editable Search Bar */}
        <div style={{ background: '#fff', borderRadius: 'var(--radius)', padding: '20px 24px', marginBottom: 24, boxShadow: 'var(--shadow)', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
            {(type === 'flights' || type === 'hotels' || type === 'cabs') && (
              <>
                <div className="field-group" style={{ flex: '1 1 150px' }}>
                  <label className="field-label">{type === 'flights' ? 'From' : type === 'hotels' ? 'City' : 'Pickup'}</label>
                  <input className="field-input" placeholder="Enter location" value={searchFrom} onChange={e => setSearchFrom(e.target.value)} />
                </div>
                {type !== 'cabs' && (
                  <div className="field-group" style={{ flex: '1 1 150px' }}>
                    <label className="field-label">{type === 'flights' ? 'To' : 'Check-in'}</label>
                    <input className="field-input" placeholder={type === 'flights' ? 'Enter destination' : 'Date'} value={searchTo} onChange={e => setSearchTo(e.target.value)} />
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
                    <input className="field-input" type="date" value={searchDate} onChange={e => setSearchDate(e.target.value)} />
                  </div>
                )}
              </>
            )}
            <button className="search-btn" onClick={handleUpdateSearch} style={{ padding: '12px 24px', height: 'fit-content', whiteSpace: 'nowrap' }}>Update</button>
          </div>
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
              <div className="filter-tag active">All</div>
              <div className="filter-tag">Budget</div>
              <div className="filter-tag">Premium</div>
              <div className="filter-tag">Non-stop only</div>
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
                <HotelCard hotel={h} onBook={handleStartBooking} onSelect={s => setToast({ message: `Selected ${s.name} — ${s.city}`, type: 'info' })} />
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
          body={selectedService ? (type === 'flights' ? `${selectedService.airline} ${selectedService.from} → ${selectedService.to} · ₹${selectedService.price}` : type === 'hotels' ? `${selectedService.name} · ${selectedService.city} · ₹${selectedService.price}` : `${selectedService.type} · ${selectedService.from} → ${selectedService.to} · ₹${selectedService.price}`) : ''}
          onCancel={() => setConfirmOpen(false)}
          onConfirm={confirmBooking}
          confirmLabel="Confirm & Pay"
        />
      </div>
      
    </div>
  );
}
