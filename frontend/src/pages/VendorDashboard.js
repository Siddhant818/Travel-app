import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import { subscribeBookingSync, emitBookingSync } from '../utils/bookingSync';

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
          Chat with {booking.customerName}
          <button className="chat-close" onClick={onClose}>✕</button>
        </div>
        <div className="chat-messages">
          {messages.length === 0 && (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '30px 0', fontSize: 13 }}>
              No messages yet.
            </div>
          )}
          {messages.map(m => (
            <div key={m.id} className={`chat-msg ${m.role === 'vendor' ? 'me' : 'other'}`}>
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

export default function VendorDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chatBooking, setChatBooking] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    if (!user || user.role !== 'vendor') { navigate('/login/vendor'); return; }
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
      const res = await api.get('/bookings/vendor');
      setBookings(res.data);
    } catch {}
    setLoading(false);
  };

  const handleAccept = async (bookingId) => {
    setActionLoading(prev => ({ ...prev, [bookingId]: 'accepting' }));
    try {
      await api.patch(`/bookings/${bookingId}/accept`);
      emitBookingSync('booking-updated', { bookingId, status: 'accepted' });
      await fetchBookings();
    } catch (e) { alert(e.response?.data?.error || 'Error'); }
    setActionLoading(prev => ({ ...prev, [bookingId]: null }));
  };

  const handleDeliver = async (bookingId) => {
    setActionLoading(prev => ({ ...prev, [bookingId]: 'delivering' }));
    try {
      await api.patch(`/bookings/${bookingId}/deliver`);
      emitBookingSync('booking-updated', { bookingId, status: 'delivered' });
      await fetchBookings();
    } catch (e) { alert(e.response?.data?.error || 'Error'); }
    setActionLoading(prev => ({ ...prev, [bookingId]: null }));
  };

  const counts = {
    all: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    accepted: bookings.filter(b => b.status === 'accepted').length,
    delivered: bookings.filter(b => b.status === 'delivered').length,
  };

  const filtered = activeFilter === 'all' ? bookings : bookings.filter(b => b.status === activeFilter);

  const revenue = bookings.filter(b => b.status === 'delivered').reduce((sum, b) => sum + (b.service?.price || 0), 0);

  const getServiceTitle = (b) => {
    if (b.serviceType === 'flight') return `${b.service?.from} → ${b.service?.to}`;
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
          <h1>{user?.companyName || user?.name}</h1>
          <p>Vendor Dashboard — {user?.type?.charAt(0).toUpperCase() + user?.type?.slice(1)} Services</p>
        </div>

        <div className="stat-grid">
          {[
            { label: 'Total Bookings', num: counts.all, icon: '\ud83d\udccb' },
            { label: 'Pending', num: counts.pending, icon: '\u25cc' },
            { label: 'Active', num: counts.accepted, icon: '\u25c9' },
            { label: 'Completed', num: counts.delivered, icon: '\u2713' },
            { label: 'Revenue Earned', num: `₹${revenue.toLocaleString('en-IN')}`, icon: '₹' },
          ].map(s => (
            <div className="stat-card" key={s.label}>
              <div style={{ fontSize: 28, marginBottom: 4 }}>{s.icon}</div>
              <div className="stat-num" style={{ fontSize: typeof s.num === 'string' ? 20 : 32 }}>{s.num}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
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
                boxShadow: 'var(--shadow)', transition: 'all 0.2s',
                position: 'relative'
              }}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)} ({counts[f]})
              {f === 'pending' && counts.pending > 0 && (
                <span style={{
                  position: 'absolute', top: -4, right: -4,
                  background: 'var(--accent)', color: '#fff',
                  borderRadius: '50%', width: 18, height: 18, fontSize: 11,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700
                }}>{counts.pending}</span>
              )}
            </button>
          ))}
        </div>

        <div className="section-title">Booking Requests</div>

        {loading ? (
          <div className="loading">Loading bookings...</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">No bookings</div>
            <h3>No bookings here</h3>
            <p>{activeFilter === 'pending' ? 'You\'re all caught up!' : 'No bookings in this category'}</p>
          </div>
        ) : (
          filtered.map(b => (
            <div className={`booking-card ${b.status}`} key={b.id}>
              <div className="booking-header">
                <div>
                  <div className="booking-title">{TYPE_ICON[b.serviceType]} {getServiceTitle(b)}</div>
                  <div className="booking-meta">
                    {b.customerName} ({b.customerEmail}) &nbsp;•&nbsp;
                    {new Date(b.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <span className={`status-badge ${b.status}`}>{b.status}</span>
              </div>

              <div style={{ display: 'flex', gap: 16, fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
                {b.serviceType === 'flight' && <span>{b.service?.date} at {b.service?.time} | {b.service?.duration}</span>}
                {b.serviceType === 'hotel' && <span>{b.service?.city} — {b.service?.roomType}</span>}
                {b.serviceType === 'cab' && <span>{b.service?.from} → {b.service?.to}</span>}
                <span style={{ color: 'var(--success)', fontWeight: 600 }}>₹{b.service?.price?.toLocaleString('en-IN')}</span>
              </div>

              {/* Status timeline */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 14, fontSize: 12 }}>
                {['pending', 'accepted', 'delivered'].map((s, i) => {
                  const statuses = ['pending', 'accepted', 'delivered'];
                  const currentIdx = statuses.indexOf(b.status);
                  const stepIdx = statuses.indexOf(s);
                  const done = stepIdx <= currentIdx;
                  return (
                    <React.Fragment key={s}>
                      <div style={{
                        padding: '3px 12px', borderRadius: 20, fontWeight: 600,
                        background: done ? (s === 'delivered' ? '#F0FFF8' : s === 'accepted' ? '#EEF7FF' : '#FFF7E6') : 'var(--bg)',
                        color: done ? (s === 'delivered' ? 'var(--success)' : s === 'accepted' ? 'var(--primary)' : 'var(--warning)') : 'var(--text-muted)',
                        border: done ? 'none' : '1px solid var(--border)'
                      }}>
                        {s === 'pending' ? 'Pending' : s === 'accepted' ? 'Accepted' : 'Delivered'}
                      </div>
                      {i < 2 && <div style={{ flex: 1, height: 1, background: done && stepIdx < currentIdx ? 'var(--primary)' : 'var(--border)' }}></div>}
                    </React.Fragment>
                  );
                })}
              </div>

              <div className="booking-actions">
                {b.status === 'pending' && (
                  <button
                    className="action-btn action-btn-green"
                    onClick={() => handleAccept(b.id)}
                    disabled={actionLoading[b.id]}
                  >
                    {actionLoading[b.id] === 'accepting' ? 'Accepting...' : 'Accept Booking'}
                  </button>
                )}
                {b.status === 'accepted' && (
                  <button
                    className="action-btn action-btn-blue"
                    onClick={() => handleDeliver(b.id)}
                    disabled={actionLoading[b.id]}
                  >
                    {actionLoading[b.id] === 'delivering' ? 'Marking...' : 'Mark as Delivered'}
                  </button>
                )}
                <button className="action-btn action-btn-outline" onClick={() => setChatBooking(b)}>
                  Chat with Customer
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
