require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');
const { renderHomePage } = require('./views/homePage');

const app = express();

// ============ Database Connection ============
connectDB();

// ============ Middleware ============
// Security headers
app.use(helmet());

// CORS - Updated for production
const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:3001',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({ 
  origin: ALLOWED_ORIGINS, 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}

// ============ Routes ============
// Root route
app.get('/', (req, res) => {
  res.type('html').send(renderHomePage({
    version: process.env.APP_VERSION,
    environment: process.env.NODE_ENV,
    uptime: process.uptime(),
    healthUrl: '/api/health'
  }));
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/search', require('./routes/search'));
app.use('/api/bookings', require('./routes/bookings'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    time: new Date(),
    environment: process.env.NODE_ENV,
    uptime: process.uptime()
  });
});

// ============ Error Handling ============
// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ 
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ============ Server Start ============
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n✅ TravelApp Backend running on http://localhost:${PORT}`);
  console.log(`📦 Environment: ${process.env.NODE_ENV}`);
  console.log(`🗄️  Database: MongoDB Atlas`);
  console.log(`📧 OTPs will be logged to console in development mode\n`);
});
