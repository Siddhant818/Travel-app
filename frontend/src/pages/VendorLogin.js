import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

export default function VendorLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/vendor/login', { email, password });
      login(res.data.user, res.data.token);
      navigate('/vendor/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page fade-in">
      <div className="auth-card fade-in">
        <div className="auth-logo">✈️ TravelApp</div>
        <h2 className="auth-title">Vendor Portal</h2>
        <p className="auth-sub">Login to manage your bookings</p>

        <div style={{ background: '#EEF7FF', borderRadius: 10, padding: '12px 14px', marginBottom: 20, fontSize: 12, color: 'var(--primary)' }}>
          <strong>Demo credentials:</strong><br />
          ✈️ Flight: vendor@indigo.com / password<br />
          Hotel: vendor@taj.com / password<br />
          Cab: vendor@ola.com / password
        </div>

        {error && <div className="error-msg">⚠️ {error}</div>}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Vendor Email</label>
            <input className="form-input" type="email" placeholder="vendor@company.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" placeholder="Your password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button className="form-btn form-btn-accent" type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Vendor Login →'}
          </button>
        </form>

        <div className="auth-switch">
          Are you a customer? <a onClick={() => navigate('/login/customer')}>Customer login</a>
        </div>
      </div>
    </div>
  );
}
