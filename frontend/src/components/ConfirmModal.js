import React from 'react';

export default function ConfirmModal({ open, title, body, onCancel, onConfirm, confirmLabel = 'Confirm' }) {
  if (!open) return null;
  return (
    <div className="confirm-modal" onClick={e => e.target === e.currentTarget && onCancel && onCancel()}>
      <div className="confirm-box fade-in">
        <div className="confirm-header"><strong>{title}</strong></div>
        <div className="confirm-body">{body}</div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
          <button className="nav-btn nav-btn-outline" onClick={onCancel}>Cancel</button>
          <button className="book-btn" onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}
