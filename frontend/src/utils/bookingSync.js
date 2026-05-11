const CHANNEL_NAME = 'travelapp-bookings';
const STORAGE_KEY = 'travelapp:booking-sync';

export function emitBookingSync(eventType, payload = {}) {
  const event = {
    eventType,
    payload,
    timestamp: Date.now(),
  };

  if (typeof window !== 'undefined') {
    try {
      if ('BroadcastChannel' in window) {
        const channel = new BroadcastChannel(CHANNEL_NAME);
        channel.postMessage(event);
        channel.close();
      }
    } catch {}

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(event));
    } catch {}
  }
}

export function subscribeBookingSync(callback) {
  if (typeof window === 'undefined') return () => {};

  let channel;
  const handleEvent = (event) => {
    if (typeof event?.data === 'object' && event.data?.eventType) {
      callback(event.data);
    }
  };

  const handleStorage = (event) => {
    if (event.key !== STORAGE_KEY || !event.newValue) return;
    try {
      callback(JSON.parse(event.newValue));
    } catch {}
  };

  if ('BroadcastChannel' in window) {
    try {
      channel = new BroadcastChannel(CHANNEL_NAME);
      channel.addEventListener('message', handleEvent);
    } catch {}
  }

  window.addEventListener('storage', handleStorage);

  return () => {
    if (channel) {
      try {
        channel.removeEventListener('message', handleEvent);
        channel.close();
      } catch {}
    }
    window.removeEventListener('storage', handleStorage);
  };
}