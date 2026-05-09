import React, { useEffect } from 'react';

export default function Toast({ message, type = 'info', onClose, duration = 2500 }) {
  useEffect(() => {
    if (!message) return;
    const id = setTimeout(() => onClose && onClose(), duration);
    return () => clearTimeout(id);
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div className={`app-toast ${type}`} onClick={() => onClose && onClose()}>
      <div className="app-toast-inner">{message}</div>
    </div>
  );
}
