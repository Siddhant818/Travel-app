import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import { subscribeBookingSync } from '../utils/bookingSync';

const TYPE_ICON = { flight: 'FL', hotel: 'HT', cab: 'CB' };

function ChatModal({ booking, onClose, user }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchMessages = useCallback(async () => {
    const res = await api.get(`/bookings/${booking.id}/messages`);
    setMessages(res.data);
  }, [booking.id]);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  const sendMessage = async () => {
    if (!text.trim()) return;
    setLoading(true);
    await api.post(`/bookings/${booking.id}/messages`, { text });
    setText('');
    await fetchMessages();
    setLoading(false);
  };

  return (
    <div className="chat-modal" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="chat-box">
        <div className="chat-header">
          Chat — {TYPE_ICON[booking.serviceType]} {booking.service?.name || booking.service?.airline || 'Booking'}
          <button className="chat-close" onClick={onClose}>✕</button>
        </div>
        <div className="chat-messages">
          {messages.length === 0 && (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '30px 0', fontSize: 13 }}>
              No messages yet. Start the conversation!
            </div>
          )}
          {messages.map(m => (
            <div key={m.id} className={`chat-msg ${m.role === 'customer' ? 'me' : 'other'}`}>
              <div className="chat-msg-name">{m.sender}</div>
              {m.text}
            </div>
          ))}
        </div>
        <div className="chat-input-row">
          <input
            className="chat-input"
            placeholder="Type a message..."
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
          />
          <button className="chat-send" onClick={sendMessage} disabled={loading}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default function CustomerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chatBooking, setChatBooking] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    if (!user || user.role !== 'customer') { navigate('/login/customer'); return; }
    fetchBookings();
    // Poll for updates every 2 seconds
    const interval = setInterval(fetchBookings, 2000);
    const unsubscribe = subscribeBookingSync(event => {
      if (event.eventType === 'booking-created' || event.eventType === 'booking-updated') {
        fetchBookings();
      }
    });
    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, [user]);

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings/my');
      setBookings(res.data);
    } catch {}
    setLoading(false);
  };

  const counts = {
    all: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    accepted: bookings.filter(b => b.status === 'accepted').length,
    delivered: bookings.filter(b => b.status === 'delivered').length,
  };

  const filtered = activeFilter === 'all' ? bookings : bookings.filter(b => b.status === activeFilter);

  const getServiceTitle = (b) => {
    if (b.serviceType === 'flight') return `${b.service?.from} → ${b.service?.to} (${b.service?.airline})`;
    if (b.serviceType === 'hotel') return b.service?.name;
    if (b.serviceType === 'cab') return `${b.service?.type} — ${b.service?.from}`;
    return 'Booking';
  };

  return (
    <div>
      <Navbar />
      {chatBooking && <ChatModal booking={chatBooking} onClose={() => setChatBooking(null)} user={user} />}

      <div className="dashboard">
        <div className="dash-header">
          <h1>Hello, {user?.name}!</h1>
          <p>Manage your travel bookings</p>
        </div>

        <div className="stat-grid">
          {[
            { label: 'Total Bookings', num: counts.all, icon: '📋' },
            { label: 'Pending', num: counts.pending, icon: '◌' },
            { label: 'Accepted', num: counts.accepted, icon: '◉' },
            { label: 'Completed', num: counts.delivered, icon: '✓' },
          ].map(s => (
            <div className="stat-card" key={s.label}>
              <div style={{ fontSize: 28, marginBottom: 4 }}>{s.icon}</div>
              <div className="stat-num">{s.num}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Quick Search */}
        <div style={{ background: '#fff', borderRadius: 'var(--radius)', padding: '20px 24px', marginBottom: 28, boxShadow: 'var(--shadow)' }}>
          <div style={{ fontWeight: 700, marginBottom: 14, fontSize: 16 }}>Quick Search</div>
          <div style={{ display: 'flex', gap: 12 }}>
            {[
              { label: 'Flights', path: '/search/flights' },
              { label: 'Hotels', path: '/search/hotels' },
              { label: 'Cabs', path: '/search/cabs' },
            ].map(s => (
              <button key={s.label}
                style={{ padding: '10px 20px', background: 'var(--bg)', border: '1.5px solid var(--border)', borderRadius: 10, cursor: 'pointer', fontWeight: 600, fontSize: 14, transition: 'all 0.2s' }}
                onClick={() => navigate(s.path)}
                onMouseEnter={e => { e.target.style.borderColor = 'var(--primary)'; e.target.style.color = 'var(--primary)'; }}
                onMouseLeave={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'inherit'; }}
              >{s.label}</button>
            ))}
          </div>
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {['all', 'pending', 'accepted', 'delivered'].map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              style={{
                padding: '7px 18px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
                background: activeFilter === f ? 'var(--primary)' : 'var(--card)',
                color: activeFilter === f ? '#fff' : 'var(--text-muted)',
                boxShadow: 'var(--shadow)', transition: 'all 0.2s'
              }}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)} ({counts[f]})
            </button>
          ))}
        </div>

        <div className="section-title">My Bookings</div>

        {loading ? (
          <div className="loading">Loading bookings...</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🧳</div>
            <h3>No bookings yet</h3>
            <p>Search for flights, hotels, or cabs to get started</p>
            <button className="book-btn" style={{ marginTop: 16 }} onClick={() => navigate('/')}>Explore Now</button>
          </div>
        ) : (
          filtered.map(b => (
            <div className={`booking-card ${b.status}`} key={b.id}>
              <div className="booking-header">
                <div>
                  <div className="booking-title">{TYPE_ICON[b.serviceType]} {getServiceTitle(b)}</div>
                  <div className="booking-meta">Booked on {new Date(b.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                </div>
                <span className={`status-badge ${b.status}`}>{b.status}</span>
              </div>
              <div style={{ display: 'flex', gap: 16, fontSize: 13, color: 'var(--text-muted)' }}>
                {b.serviceType === 'flight' && <span>{b.service?.date} at {b.service?.time}</span>}
                {b.serviceType === 'hotel' && <span>{b.service?.city} — {b.service?.roomType}</span>}
                {b.serviceType === 'cab' && <span>{b.service?.from} → {b.service?.to} • ETA {b.service?.eta}</span>}
                <span>₹{b.service?.price?.toLocaleString('en-IN')}</span>
              </div>
              <div className="booking-actions">
                <button className="action-btn action-btn-outline" onClick={() => setChatBooking(b)}>
                  Chat with Vendor
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
