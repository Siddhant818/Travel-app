import React from 'react';

export default function FlightCard({ flight, onBook, onSelect }) {
  const formatPrice = p => '₹' + p.toLocaleString('en-IN');

  return (
    <div className="flight-card">
      <div className="airline-info">
        <div className="airline-logo">FL</div>
        <div>
          <div className="airline-name">{flight.airline}</div>
          <div className="airline-class">{flight.class}</div>
        </div>
      </div>

      <div className="flight-times">
        <div className="time-point">
          <div className="time">{flight.time}</div>
          <div className="city">{flight.from}</div>
        </div>
        <div className="flight-duration">
          <div>{flight.duration}</div>
          <div className="duration-line">
            <div className="duration-bar"></div>
            <span>✈</span>
            <div className="duration-bar"></div>
          </div>
          <div className="stops">Non-stop</div>
        </div>
        <div className="time-point">
          <div className="time">–</div>
          <div className="city">{flight.to}</div>
        </div>
      </div>

      <div className="flight-price">
        <div className="price">{formatPrice(flight.price)}</div>
        <div className="price-sub">per person</div>
        <div style={{ fontSize: 11, color: 'var(--success)', marginBottom: 8 }}>
          {flight.seats} seats left
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'flex-end' }}>
          <button className="nav-btn nav-btn-outline" onClick={() => onSelect && onSelect(flight)}>Details</button>
          <button className="book-btn" onClick={() => onBook(flight)}>Book Now</button>
        </div>
      </div>
    </div>
  );
}
