import React from 'react';

export default function CabCard({ cab, onBook, onSelect }) {
  const formatPrice = p => '₹' + p.toLocaleString('en-IN');

  return (
    <div className="cab-card">
      <div className="cab-icon">CB</div>
      <div className="cab-info">
        <div className="cab-type">{cab.type}</div>
        <div className="cab-route">{cab.from} → {cab.to}</div>
        <div className="cab-details">
          <div className="cab-detail">⏱️ {cab.eta}</div>
          <div className="cab-detail">{cab.capacity} seats</div>
          {cab.ac && <div className="cab-detail">❄️ AC</div>}
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: 22, fontWeight: 800 }}>{formatPrice(cab.price)}</div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 10 }}>one way</div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button className="nav-btn nav-btn-outline" onClick={() => onSelect && onSelect(cab)}>Details</button>
          <button className="book-btn" onClick={() => onBook(cab)}>Book Now</button>
        </div>
      </div>
    </div>
  );
}
