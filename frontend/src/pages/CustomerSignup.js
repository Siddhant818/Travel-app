import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

export default function CustomerSignup() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [step, setStep] = useState(1); // 1=form, 2=otp
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [devOtp, setDevOtp] = useState('');

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/customer/request-otp', { name, email, password, phone });
      setDevOtp(res.data.devOtp || '');
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/customer/verify-otp', { email, otp });
      login(res.data.user, res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page fade-in">
      <div className="auth-card fade-in">
        <div className="auth-logo">✈️ TravelApp</div>
        <h2 className="auth-title">{step === 1 ? 'Create Account' : 'Verify Email'}</h2>
        <p className="auth-sub">
          {step === 1 ? 'Join TravelApp to book flights, hotels & cabs' : `Enter the OTP sent to ${email}`}
        </p>

        {error && <div className="error-msg">⚠️ {error}</div>}

        {step === 1 ? (
          <form onSubmit={handleRequestOTP}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" placeholder="Rahul Sharma" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input className="form-input" type="email" placeholder="rahul@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Phone (optional)</label>
              <input className="form-input" placeholder="+91 98765 43210" value={phone} onChange={e => setPhone(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" placeholder="Min 6 characters" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
            </div>
            <button className="form-btn form-btn-accent" type="submit" disabled={loading}>
              {loading ? 'Sending OTP...' : 'Send OTP →'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP}>
            {devOtp && (
              <div className="otp-hint">
                <strong>Dev Mode OTP:</strong> {devOtp} <br />
                <span style={{ fontSize: 11 }}>(In production this would be emailed)</span>
              </div>
            )}
            <div className="form-group">
              <label className="form-label">6-Digit OTP</label>
              <input
                className="form-input"
                placeholder="Enter OTP"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                maxLength={6}
                required
                style={{ fontSize: 22, letterSpacing: 8, textAlign: 'center' }}
              />
            </div>
            <button className="form-btn" type="submit" disabled={loading}>
              {loading ? 'Verifying...' : '✅ Verify & Create Account'}
            </button>
            <button
              type="button"
              style={{ width: '100%', marginTop: 10, background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: 13 }}
              onClick={() => { setStep(1); setError(''); }}
            >
              ← Change email
            </button>
          </form>
        )}

        <div className="auth-switch">
          Already have an account? <a onClick={() => navigate('/login/customer')}>Login here</a>
        </div>
      </div>
    </div>
  );
}
