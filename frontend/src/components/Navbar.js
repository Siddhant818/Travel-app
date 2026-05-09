import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="nav">
      <div className="nav-container">
        <div className="nav-logo" onClick={() => navigate('/')}>✈️ TravelApp</div>
        <div className="nav-links">
        {!user ? (
          <>
            <button className="nav-btn nav-btn-outline" onClick={() => navigate('/login/customer')}>
              Customer Login
            </button>
            <button className="nav-btn nav-btn-primary" onClick={() => navigate('/login/vendor')}>
              Vendor Login
            </button>
          </>
        ) : (
          <>
            <div className="nav-user">
              <div className="nav-avatar">{user.name?.[0]?.toUpperCase()}</div>
              <span className="nav-username">{user.name}</span>
              {user.role === 'vendor' && (
                <span className="vendor-badge">VENDOR</span>
              )}
            </div>
            <div className="nav-actions">
              <button
                className="nav-btn nav-btn-outline"
                onClick={() => navigate(user.role === 'vendor' ? '/vendor/dashboard' : '/customer/dashboard')}
              >
                Dashboard
              </button>
              <button className="nav-logout" onClick={handleLogout}>Logout</button>
            </div>
          </>
        )}
        </div>
      </div>
    </nav>
  );
}
