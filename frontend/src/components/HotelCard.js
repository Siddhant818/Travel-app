import React from 'react';

export default function HotelCard({ hotel, onBook, onSelect }) {
  const formatPrice = p => '₹' + p.toLocaleString('en-IN');
  const stars = '★'.repeat(hotel.rating);

  return (
    <div className="hotel-card">
      <div className="hotel-img">HT</div>
      <div className="hotel-info">
        <div className="hotel-name">{hotel.name}</div>
        <div className="hotel-city">{hotel.city} · {hotel.roomType}</div>
        <div className="hotel-stars">{stars}</div>
        <div className="hotel-amenities">
          {hotel.amenities.map(a => <span className="amenity-tag" key={a}>{a}</span>)}
        </div>
        <div className="hotel-footer">
          <div>
            <span style={{ fontSize: 22, fontWeight: 800 }}>{formatPrice(hotel.price)}</span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}> / night</span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="nav-btn nav-btn-outline" onClick={() => onSelect && onSelect(hotel)}>Details</button>
            <button className="book-btn" onClick={() => onBook(hotel)}>Book Now</button>
          </div>
        </div>
      </div>
    </div>
  );
}
