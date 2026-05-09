import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

export default function CustomerLogin() {
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
      const res = await api.post('/auth/customer/login', { email, password });
      login(res.data.user, res.data.token);
      navigate('/');
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
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-sub">Login to your customer account</p>

        {error && <div className="error-msg">⚠️ {error}</div>}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input className="form-input" type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" placeholder="Your password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button className="form-btn" type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login →'}
          </button>
        </form>

        <div className="auth-switch">
          New user? <a onClick={() => navigate('/signup/customer')}>Create account</a>
        </div>
        <div className="auth-switch" style={{ marginTop: 8 }}>
          Are you a vendor? <a onClick={() => navigate('/login/vendor')}>Vendor login</a>
        </div>
      </div>
    </div>
  );
}
