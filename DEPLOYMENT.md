# TravelApp - Production Deployment Guide

## Prerequisites

- Node.js 14+ and npm
- MongoDB Atlas account (free tier available)
- Git
- Code editor (VS Code recommended)

## Backend Setup

### 1. Environment Configuration

Create `.env` file in `backend/` directory:

```env
PORT=5000
NODE_ENV=development

# MongoDB URI from MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/travelapp?retryWrites=true&w=majority

# JWT Secret (change this in production!)
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRY=7d

# Email Configuration (SendGrid preferred in production)
SENDGRID_API_KEY=your_sendgrid_api_key_here
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-specific-password
SMTP_FROM=noreply@travelapp.com

# Frontend URL
FRONTEND_URL=http://localhost:3001
```

### 2. MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a cluster (select free tier)
4. Add your IP address to the whitelist
5. Create a database user with a strong password
6. Copy the connection string and update `MONGODB_URI` in `.env`

### 3. Install Dependencies

```bash
cd backend
npm install
```

### 4. Seed the Database

```bash
npm run seed
```

This creates 40 flights and initial vendors with test credentials.

### 5. Start the Backend

**Development (with auto-reload):**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

Backend will be running on `http://localhost:5000`

## Frontend Setup

### 1. Environment Configuration

Create `.env` file in `frontend/` directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 2. Install Dependencies

```bash
cd frontend
npm install
```

### 3. Start Development Server

```bash
npm start
```

Frontend will open at `http://localhost:3001`

### 4. Build for Production

```bash
npm run build
```

This creates an optimized production build in `frontend/build/`

## Test Credentials

### Customer Login
- Email-based authentication with OTP
- Use any email address to get an OTP (logged to console in dev)

### Vendor Login
```
Flight Vendor:  vendor@indigo.com / password
Hotel Vendor:   vendor@taj.com / password
Cab Vendor:     vendor@ola.com / password
```

## Database Models

### User
- Email, name, phone, role (customer/vendor)
- For vendors: type (flight/hotel/cab), companyName
- Password (hashed with bcrypt)
- Verified status, timestamps

### Flight
- Airline, from, to, date, time, duration
- Price, seats, class, seatsBooked
- VendorId reference, timestamps

### Hotel
- Name, city, address, rating, price
- Amenities, roomType, rooms, roomsBooked
- Description, image, VendorId, timestamps

### Cab
- Type (Mini/Sedan/SUV), from, to, price
- ETA, capacity, AC flag, available status
- VendorId reference, timestamps

### Booking
- CustomerId, vendorId, serviceType, serviceId
- Service details snapshot
- Status (pending/accepted/delivered/cancelled)
- Payment status, timestamps

### Message
- BookingId, senderId, text
- Read status, timestamps

### OTP
- Email, OTP code, expiresAt
- UserData (temporary storage)
- Auto-deletes after 10 minutes

## Deployment Options

### Option 1: Railway.app (Recommended for beginners)

1. Go to [Railway.app](https://railway.app)
2. Create account and connect GitHub
3. Create a new project
4. Add MongoDB plugin
5. Deploy your backend repo
6. Set environment variables in Railway dashboard
	- `SENDGRID_API_KEY` = your SendGrid API key (recommended for production)
	- Keep `SMTP_*` only as local/dev fallback if you still want Gmail SMTP for testing
7. Get the production URL

### Option 2: Render.com

1. Go to [Render.com](https://render.com)
2. Create account
3. Create new Web Service
4. Connect your GitHub repo
5. Set environment variables
6. Deploy

### Option 3: AWS, Google Cloud, Azure

Requires more configuration but provides enterprise features.

## Frontend Deployment

### Vercel (Recommended for React)

1. Go to [Vercel.com](https://vercel.com)
2. Connect your GitHub account
3. Import your repository
4. Set environment variable: `REACT_APP_API_URL` = your backend URL
5. Deploy

### Alternative: Netlify

Similar process to Vercel, works equally well for React apps.

## Production Checklist

### Backend
- [ ] Set `NODE_ENV=production`
- [ ] Update `JWT_SECRET` to a strong random value
- [ ] Use real MongoDB Atlas connection (not local)
- [ ] Configure real email service (Gmail/SendGrid/AWS SES)
- [ ] Enable CORS only for your frontend domain
- [ ] Set strong database passwords
- [ ] Enable MongoDB backup
- [ ] Setup error monitoring (Sentry)
- [ ] Configure rate limiting
- [ ] Use HTTPS everywhere
- [ ] Add request logging and monitoring

### Frontend
- [ ] Update `REACT_APP_API_URL` to production backend
- [ ] Build with `npm run build`
- [ ] Test all features in staging environment
- [ ] Configure CDN for static assets
- [ ] Setup analytics (Google Analytics)
- [ ] Configure favicon and metadata
- [ ] Test on multiple browsers
- [ ] Test on mobile devices
- [ ] Setup SSL certificate

### Database
- [ ] Enable MongoDB authentication
- [ ] Add IP whitelist (production server only)
- [ ] Enable backups and point-in-time recovery
- [ ] Monitor storage and upgrade as needed
- [ ] Create read replicas for high availability
- [ ] Setup database indexing for performance

## Common Issues

### MongoDB Connection Failed
- Check MONGODB_URI format
- Verify IP address is whitelisted in MongoDB Atlas
- Ensure database user password is correct
- Check network connectivity

### CORS Errors
- Verify frontend URL is in `ALLOWED_ORIGINS`
- Clear browser cache
- Check if credentials are being sent correctly

### OTP Not Received
- In development, check console logs
- For production, verify SMTP credentials
- Check email spam folder
- Ensure sender email is verified

### API Returns 401
- Check JWT token is being sent in headers
- Verify JWT_SECRET matches between frontend and backend
- Check token expiration
- Verify user is authenticated

## Support & Troubleshooting

- Check logs in production: `Railway/Render dashboard`
- Monitor MongoDB: `MongoDB Atlas dashboard`
- Debug frontend: Chrome DevTools
- Backend errors: Check server console output

## Performance Optimization

- Enable caching headers in backend
- Compress responses with gzip
- Optimize database queries with indexes
- Use CDN for static assets
- Implement pagination for large datasets
- Add response caching with Redis (optional)

## Security Considerations

- Never commit `.env` to GitHub
- Use environment variables for all secrets
- Implement rate limiting on auth endpoints
- Validate all user inputs
- Use HTTPS in production
- Implement CSRF protection
- Add security headers (helmet middleware enabled)
- Regular security audits

---

**Version:** 1.0.0  
**Last Updated:** 2024  
**Status:** Production Ready

## Production domains (current)

- Backend (Railway): https://travel-app-production-8cb7.up.railway.app
- Frontend (Vercel): https://travel-app-bdqg.vercel.app/

Use these values when configuring `FRONTEND_URL` on the backend host and `REACT_APP_API_URL` on Vercel. Remember to redeploy the frontend after changing `REACT_APP_API_URL` in Vercel so the new value is embedded at build time.
