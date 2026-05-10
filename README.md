# ✈️ TravelApp — MakeMyTrip-style Travel Booking Platform

A production-ready full-stack travel booking application with separate portals for **Customers** and **Vendors**. Book flights, hotels, and cabs with real-time OTP verification and vendor management.

**Table of Contents**: [Overview](#overview) • [Tech Stack](#tech-stack) • [Features](#features) • [Quick Start](#quick-start) • [Database Setup](#database-setup) • [Environment Variables](#environment-variables) • [API Reference](#api-reference) • [Deployment](#deployment) • [Troubleshooting](#troubleshooting)

---

## Overview

TravelApp is a modern travel booking platform that mimics MakeMyTrip and Cleartrip. It allows:

- **Customers** to search and book flights, hotels, and cabs online with secure OTP-based authentication.
- **Vendors** to manage bookings in real-time, with dashboard analytics and customer communication.
- **Real-time Chat** between customers and vendors for support.

### Key Highlights
- ✅ **MongoDB Atlas** — Cloud database with Mongoose ODM
- ✅ **SendGrid Integration** — Reliable production email delivery
- ✅ **OTP Authentication** — Secure email-based signup
- ✅ **JWT-based Sessions** — Stateless API authentication
- ✅ **Responsive UI** — React-based modern frontend
- ✅ **Vendor Dashboard** — Real-time booking management
- ✅ **Pre-seeded Data** — 40 flights, vendors, hotels, and cabs ready to test

---

## Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| **React 18** | UI library with hooks |
| **React Router v6** | Client-side routing |
| **Axios** | HTTP client for API calls |
| **CSS3** | Styling (responsive design, CSS Grid/Flexbox) |

### Backend
| Technology | Purpose |
|-----------|---------|
| **Node.js (v22.x)** | JavaScript runtime |
| **Express.js** | Web framework |
| **MongoDB Atlas** | Cloud NoSQL database |
| **Mongoose 9.x** | MongoDB ODM |
| **JWT (jsonwebtoken)** | Stateless authentication |
| **Bcryptjs** | Password hashing |
| **SendGrid** | Email delivery service |
| **Nodemailer** | Email library (dev fallback) |
| **Helmet** | Security headers |
| **Morgan** | HTTP request logging |

### DevOps & Deployment
- **Railway** — Backend hosting (free tier available)
- **Vercel** — Frontend hosting (free tier, auto-deploy from Git)
- **MongoDB Atlas** — Managed cloud database (free tier: 512 MB storage)
- **SendGrid** — Email API (free tier: 100 emails/day)

---

## Features

### 🚀 Customer Portal

#### Authentication
- **Email OTP Signup** — 6-digit OTP sent to email, valid for 10 minutes
- **Password-Protected Account** — Bcrypt hashing, 6+ char minimum
- **Persistent Login** — JWT tokens with 7-day expiry

#### Search & Booking
- **Search Flights** — Filter by departure city, arrival city, date
- **Search Hotels** — Browse by city with price and ratings
- **Search Cabs** — Pickup location and service type
- **One-Click Booking** — Instant confirmation with booking ID
- **View Bookings** — Dashboard with full booking history
- **Filter by Status** — Pending, Accepted, Delivered
- **Real-time Updates** — Chat with vendors for support

#### Dashboard
- Complete booking history with timestamps
- Booking status tracking (Pending → Accepted → Delivered)
- Quick re-book functionality
- Account settings and profile management

---

### 🏪 Vendor Portal

#### Login & Access
- Email + password login (pre-seeded vendors)
- Role-based access control
- Vendor type identification (Flight, Hotel, Cab)

#### Booking Management
- Real-time booking request notifications
- Accept/Reject bookings
- Mark bookings as delivered
- View revenue and booking statistics
- Filter bookings by status

#### Communication
- Real-time chat with customers
- Message history persistence
- Instant notifications for new messages
- Badge indicators for unread messages

#### Dashboard Analytics
- Total bookings count
- Revenue summary
- Booking status breakdown

---

## Quick Start

### Prerequisites
- **Node.js** v18+ and npm/yarn
- **MongoDB Atlas Account** (free tier)
- **SendGrid Account** (optional for prod, free tier)
- **Git** for cloning and version control

### 1. Clone Repository
```bash
git clone https://github.com/Siddhant818/Travel-app.git
cd Travel-app
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
FRONTEND_URL=http://localhost:3000
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-gmail@gmail.com
SMTP_PASS=your-app-specific-password
SMTP_FROM=noreply@travelapp.com
```

Start the backend:
```bash
npm start
# Backend runs on http://localhost:5000
```

### 3. Frontend Setup

Open a **new terminal** in the project root:
```bash
cd frontend
npm install
```

Create a `.env.local` file in `frontend/`:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

Start the frontend:
```bash
npm start
# Frontend runs on http://localhost:3000
```

### 4. Seed Sample Data

In the backend terminal, run:
```bash
npm run seed
```

Output:
```
✅ MongoDB Connected: ...
✅ Created 3 vendors (Indigo, Taj, Ola)
✅ Created 40 flights
✅ Created 5 hotels
✅ Created 5 cabs
✅ Database seeded successfully!
```

### 5. Test the App

#### Customer Signup
1. Navigate to http://localhost:3000/signup/customer
2. Fill in email, password, name
3. Click "Send OTP"
4. In development: OTP is shown in the signup page UI (no email needed)
5. Enter OTP and create account
6. Redirected to dashboard

#### Vendor Login (Pre-seeded)
1. Navigate to http://localhost:3000/login/vendor
2. Use credentials:
   - **Flight Vendor**: `vendor@indigo.com` / `password`
   - **Hotel Vendor**: `vendor@taj.com` / `password`
   - **Cab Vendor**: `vendor@ola.com` / `password`

---

## Database Setup

### MongoDB Atlas (Cloud)

1. **Create Free Account**
   - Visit https://www.mongodb.com/cloud/atlas
   - Sign up with Google or email

2. **Create Free Cluster**
   - Click "Build a Cluster"
   - Select "Shared" (free tier)
   - Choose region closest to you
   - Click "Create Cluster"

3. **Create Database User**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Username: `travelapp_user`
   - Password: Generate secure password, copy it
   - Select "Built-in Role" → "Read and write to any database"
   - Click "Add User"

4. **Whitelist IP**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Select "Allow Access from Anywhere" (for development)
   - For production: add specific Railway IP ranges
   - Click "Confirm"

5. **Get Connection String**
   - Click "Database"
   - Click "Connect" on your cluster
   - Choose "Drivers"
   - Copy connection string (looks like: `mongodb+srv://user:pass@cluster.mongodb.net/dbname?retryWrites=true&w=majority`)
   - Replace `<password>` with your database user password
   - This is your `MONGODB_URI`

### MongoDB Models

TravelApp uses these Mongoose models:

```javascript
// User: Customers and Vendors
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: 'customer' | 'vendor',
  phone: String,
  vendorType: String (for vendors: 'flight', 'hotel', 'cab'),
  companyName: String (for vendors)
}

// Flight, Hotel, Cab: Service listings
{
  vendorId: ObjectId,
  name: String,
  price: Number,
  availability: Number
}

// Booking: Customer orders
{
  customerId: ObjectId,
  vendorId: ObjectId,
  serviceType: 'flight' | 'hotel' | 'cab',
  status: 'pending' | 'accepted' | 'delivered',
  amount: Number,
  createdAt: Date
}

// OTP: Temporary signup codes
{
  email: String,
  otp: String (6-digit),
  expiry: Date (10 min),
  userData: { name, email, password, phone }
}

// Message: Real-time chat
{
  senderId: ObjectId,
  receiverId: ObjectId,
  text: String,
  createdAt: Date
}
```

---

## Environment Variables

### Backend (`.env`)

| Variable | Example | Description |
|----------|---------|-------------|
| `NODE_ENV` | `development` | `development` or `production` |
| `PORT` | `5000` | Server port |
| `MONGODB_URI` | `mongodb+srv://user:pass@cluster...` | MongoDB Atlas connection string |
| `JWT_SECRET` | `your-secret-key-min-32-chars` | Secret for signing JWT tokens |
| `FRONTEND_URL` | `http://localhost:3000` | Frontend origin for CORS |
| `SENDGRID_API_KEY` | `SG.xxxxxxxxxxxx` | SendGrid API key (production email) |
| `SMTP_FROM` | `noreply@travelapp.com` | Sender email address |
| `SMTP_HOST` | `smtp.gmail.com` | SMTP server (fallback for email) |
| `SMTP_PORT` | `587` | SMTP port |
| `SMTP_USER` | `your-email@gmail.com` | SMTP username |
| `SMTP_PASS` | `app-specific-password` | SMTP password (use App Password for Gmail) |

### Frontend (`.env.local`)

| Variable | Example | Description |
|----------|---------|-------------|
| `REACT_APP_API_URL` | `http://localhost:5000/api` | Backend API URL (no trailing slash) |

> **Important**: Never commit `.env` files to Git. Use `.env.example` to document needed variables.

---

## API Reference

### Base URL
- Local: `http://localhost:5000/api`
- Production: `https://your-backend.up.railway.app/api`

### Authentication Routes

#### POST `/auth/customer/request-otp`
Request 6-digit OTP for signup.

**Request:**
```json
{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "password": "SecurePass123",
  "phone": "+91 98765 43210"
}
```

**Response (Development):**
```json
{
  "message": "OTP sent to email.",
  "devOtp": "462443"
}
```

**Response (Production):**
```json
{
  "message": "OTP sent to email."
}
```

---

#### POST `/auth/customer/verify-otp`
Verify OTP and create customer account.

**Request:**
```json
{
  "email": "rahul@example.com",
  "otp": "462443"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Rahul Sharma",
    "email": "rahul@example.com",
    "role": "customer"
  }
}
```

---

#### POST `/auth/customer/login`
Login with email and password.

**Request:**
```json
{
  "email": "rahul@example.com",
  "password": "SecurePass123"
}
```

**Response:** Same as `/verify-otp`

---

#### POST `/auth/vendor/login`
Login as vendor.

**Request:**
```json
{
  "email": "vendor@indigo.com",
  "password": "password"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Indigo Airlines",
    "email": "vendor@indigo.com",
    "role": "vendor",
    "type": "flight",
    "companyName": "Indigo Airlines"
  }
}
```

---

### Search Routes

#### GET `/search/flights?from=Delhi&to=Mumbai&date=2026-05-15`
Search available flights.

**Query Parameters:**
- `from` (required): Departure city
- `to` (required): Destination city
- `date` (required): Travel date (YYYY-MM-DD)

**Response:**
```json
[
  {
    "id": "507f1f77bcf86cd799439011",
    "vendorId": "507f1f77bcf86cd799439012",
    "vendor": {
      "name": "Indigo Airlines",
      "companyName": "Indigo Airlines"
    },
    "name": "6E 101",
    "from": "Delhi",
    "to": "Mumbai",
    "departure": "08:00",
    "arrival": "10:00",
    "price": 3500,
    "seats": 50
  }
]
```

---

#### GET `/search/hotels?city=Paris`
Search hotels by city.

**Query Parameters:**
- `city` (required): City name

**Response:**
```json
[
  {
    "id": "507f1f77bcf86cd799439011",
    "vendor": { "name": "Taj Hotels", "companyName": "Taj Hotels" },
    "name": "Taj Paris Suite",
    "city": "Paris",
    "price": 150,
    "rating": 4.5,
    "rooms": 30
  }
]
```

---

#### GET `/search/cabs?pickupLocation=Times+Square`
Search cabs by location.

**Query Parameters:**
- `pickupLocation` (required): Pickup city/area

**Response:**
```json
[
  {
    "id": "507f1f77bcf86cd799439011",
    "vendor": { "name": "Ola Cabs", "companyName": "Ola Cabs" },
    "name": "Ola Prime",
    "pickupLocation": "Times Square",
    "price": 25,
    "availability": 15
  }
]
```

---

### Booking Routes

#### POST `/bookings` (requires JWT token)
Create a new booking.

**Header:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Request:**
```json
{
  "serviceId": "507f1f77bcf86cd799439011",
  "serviceType": "flight",
  "vendorId": "507f1f77bcf86cd799439012",
  "amount": 3500
}
```

**Response:**
```json
{
  "id": "507f1f77bcf86cd799439013",
  "customerId": "507f1f77bcf86cd799439014",
  "vendorId": "507f1f77bcf86cd799439012",
  "serviceType": "flight",
  "status": "pending",
  "amount": 3500,
  "createdAt": "2026-05-10T10:30:00Z"
}
```

---

#### GET `/bookings` (requires JWT token)
Get all bookings for logged-in user.

**Response:**
```json
[
  {
    "id": "507f1f77bcf86cd799439013",
    "serviceType": "flight",
    "vendor": { "name": "Indigo Airlines" },
    "status": "pending",
    "amount": 3500,
    "createdAt": "2026-05-10T10:30:00Z"
  }
]
```

---

#### PATCH `/bookings/:bookingId` (requires vendor JWT)
Update booking status (vendor action).

**Request:**
```json
{
  "status": "accepted"
}
```

Allowed transitions: `pending` → `accepted` → `delivered`

---

### Chat Routes

#### POST `/bookings/:bookingId/chat` (requires JWT)
Send a message.

**Request:**
```json
{
  "text": "Can we reschedule to tomorrow?"
}
```

---

#### GET `/bookings/:bookingId/chat` (requires JWT)
Get chat history.

**Response:**
```json
[
  {
    "id": "507f1f77bcf86cd799439013",
    "sender": { "name": "Rahul Sharma" },
    "text": "Can we reschedule?",
    "createdAt": "2026-05-10T10:45:00Z"
  }
]
```

---

## Authentication Flow

### OTP Signup (Customers)

```
1. User enters email, password, name
   ↓
2. Backend generates 6-digit OTP
   ├─ Dev: OTP returned in response + console log
   └─ Prod: OTP sent via SendGrid email
   ↓
3. User enters OTP in UI
   ↓
4. Backend verifies OTP (must be within 10 min)
   ↓
5. User account created (password hashed)
   ├─ OTP record deleted from DB
   └─ JWT token generated
   ↓
6. User logged in, redirected to dashboard
```

### JWT Token
- **Duration**: 7 days
- **Payload**: `{ id, email, name, role }`
- **Usage**: Add to `Authorization: Bearer <token>` header
- **Storage**: LocalStorage (frontend)

---

## Email Configuration

### Development
- **Method**: Ethereal SMTP (test account)
- **Flow**: OTP shown in UI, logged to console, optional email preview
- **No Setup**: Works out of the box

### Production (SendGrid)

1. **Create SendGrid Account**
   - Visit https://sendgrid.com
   - Sign up (free tier: 100 emails/day)

2. **Create API Key**
   - Go to Settings → API Keys
   - Click "Create API Key"
   - Name it "TravelApp"
   - Copy the key (looks like: `SG.xxxxxxxxxxxxx`)

3. **Verify Sender Identity**
   - Go to Settings → Sender Authentication
   - Click "Verify a Single Sender" or "Authenticate Your Domain"
   - Single Sender: easier, verify one email
   - Domain: production-grade, requires DNS records

4. **Add to Railway**
   - In your Railway project, go to Variables
   - Add `SENDGRID_API_KEY = SG.xxxxxxxxxxxxx`
   - Add `SMTP_FROM = noreply@yourdomain.com` (verified address)
   - Redeploy

5. **Testing Email Delivery**
   - Go through signup flow
   - Check inbox (and spam folder)
   - Confirm OTP arrives

---

## Deployment

### Backend (Railway)

1. **Connect Repository**
   - Visit https://railway.app
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Authenticate and select `Travel-app` repo

2. **Set Environment Variables**
   - In Railway dashboard, go to Variables tab
   - Add all from your local `.env`:
     ```
     NODE_ENV=production
     PORT=5000
     MONGODB_URI=<your-mongodb-uri>
     JWT_SECRET=<your-jwt-secret>
     FRONTEND_URL=https://your-frontend.vercel.app
     SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
     SMTP_FROM=noreply@yourdomain.com
     SMTP_HOST=smtp.gmail.com
     SMTP_PORT=587
     SMTP_USER=your-email@gmail.com
     SMTP_PASS=your-app-password
     ```

3. **Deploy**
   - Railway auto-deploys on `git push`
   - Monitor logs in dashboard
   - Get backend URL: `https://project-name.up.railway.app`

4. **Verify Deployment**
   ```bash
   curl https://project-name.up.railway.app/api/search/flights?from=Delhi&to=Mumbai
   # Should return flights or empty array
   ```

---

### Frontend (Vercel)

1. **Connect Repository**
   - Visit https://vercel.com
   - Click "Import Project"
   - Select GitHub, choose `Travel-app` repo
   - Click "Import"

2. **Configure Build**
   - **Framework**: Create React App
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Root Directory**: `frontend`

3. **Set Environment Variables**
   - In Vercel project settings, go to Environment Variables
   - Add: `REACT_APP_API_URL=https://your-backend-url/api`
   - Save

4. **Deploy**
   - Click "Deploy"
   - Vercel auto-deploys on Git push
   - Monitor build logs
   - Get frontend URL: `https://your-project.vercel.app`

5. **Update Backend CORS**
   - Go back to Railway
   - Update `FRONTEND_URL=https://your-project.vercel.app`
   - Redeploy

---

## Testing

### Manual Testing

#### Test Signup Flow (Customer)
```bash
# 1. Request OTP
curl -X POST http://localhost:5000/api/auth/customer/request-otp \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "TestPass123",
    "phone": "+91 98765 43210"
  }'

# Response (dev):
# { "message": "OTP sent to email.", "devOtp": "123456" }

# 2. Verify OTP
curl -X POST http://localhost:5000/api/auth/customer/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "otp": "123456"
  }'

# Response:
# { "token": "eyJ...", "user": { ... } }
```

#### Test Search
```bash
curl "http://localhost:5000/api/search/flights?from=Delhi&to=Mumbai&date=2026-05-15"

# Response:
# [
#   {
#     "id": "...",
#     "name": "6E 101",
#     "price": 3500,
#     ...
#   }
# ]
```

#### Test Authenticated Request (with JWT)
```bash
# Replace TOKEN with actual JWT from login
curl http://localhost:5000/api/bookings \
  -H "Authorization: Bearer eyJ..." \
  -H "Content-Type: application/json"
```

---

## Troubleshooting

### Backend Issues

#### Port Already in Use
```bash
# Kill process using port 5000
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

#### MongoDB Connection Fails
- Check `MONGODB_URI` in `.env` is correct
- Verify IP is whitelisted in MongoDB Atlas → Network Access
- Ensure database user password is URL-encoded (e.g., `p@ss` → `p%40ss`)

#### OTP Email Not Sending
- **Dev**: Check backend console for OTP
- **Prod**: Verify `SENDGRID_API_KEY` is set in Railway
- Check sender is verified in SendGrid account
- Monitor Railway logs for SMTP errors

#### CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
- Add frontend URL to `FRONTEND_URL` in backend `.env`
- Ensure backend is setting `Access-Control-Allow-Origin` header

---

### Frontend Issues

#### API URL Not Found
- Ensure `.env.local` has `REACT_APP_API_URL=http://localhost:5000/api`
- Restart dev server after changing `.env.local`
- Check Network tab in DevTools for actual API URL being called

#### Blank Page on Load
- Check browser console for errors
- Ensure backend is running and accessible
- Clear cache: `npm run build` and restart

---

### General

#### Can't Login to Pre-seeded Vendor
- Ensure database is seeded: `npm run seed`
- Check MongoDB Atlas has data: use MongoDB Compass
- Verify `MONGODB_URI` is correct

#### Booking Not Created
- Verify JWT token is valid (not expired)
- Check `Authorization` header is present
- Ensure service `vendorId` exists in database

---

## Project File Structure (Detailed)

```
Travel-app/
│
├── backend/
│   ├── src/
│   │   ├── index.js              # Express app setup, middleware, routes
│   │   ├── config/
│   │   │   └── db.js             # MongoDB connection
│   │   ├── models/
│   │   │   ├── User.js           # Customer & Vendor schema
│   │   │   ├── Flight.js         # Flight listings
│   │   │   ├── Hotel.js          # Hotel listings
│   │   │   ├── Cab.js            # Cab services
│   │   │   ├── Booking.js        # Customer bookings
│   │   │   ├── OTP.js            # OTP temporary storage
│   │   │   └── Message.js        # Chat messages
│   │   ├── middleware/
│   │   │   ├── auth.js           # JWT verification, auth routes
│   │   │   └── validation.js     # Joi schema validation
│   │   ├── routes/
│   │   │   ├── auth.js           # /api/auth/* endpoints
│   │   │   ├── search.js         # /api/search/* endpoints
│   │   │   └── bookings.js       # /api/bookings/* endpoints
│   │   ├── utils/
│   │   │   ├── otp.js            # OTP generation & email sending
│   │   │   └── validators.js     # Joi validation schemas
│   │   ├── seeds/
│   │   │   └── seedDatabase.js   # Database seeding script
│   │   └── views/
│   │       └── homePage.js       # Root route HTML
│   ├── package.json
│   ├── .env.example
│   └── README.md
│
├── frontend/
│   ├── public/
│   │   ├── index.html            # Root HTML
│   │   └── favicon.ico
│   ├── src/
│   │   ├── index.js              # React entry point
│   │   ├── index.css             # Global styles
│   │   ├── App.js                # Route definitions
│   │   ├── context/
│   │   │   └── AuthContext.js    # Global auth state (Redux alternative)
│   │   ├── pages/
│   │   │   ├── Home.js           # Landing page + search
│   │   │   ├── CustomerSignup.js # OTP signup form
│   │   │   ├── CustomerLogin.js  # Customer login
│   │   │   ├── VendorLogin.js    # Vendor login
│   │   │   ├── SearchResults.js  # Flight/Hotel/Cab results
│   │   │   ├── CustomerDashboard.js
│   │   │   └── VendorDashboard.js
│   │   ├── components/
│   │   │   └── Navbar.js         # Navigation header
│   │   └── utils/
│   │       └── api.js            # Axios instance with base URL
│   ├── package.json
│   ├── .env.example
│   └── README.md
│
├── README.md                      # This file
├── .gitignore
└── LICENSE
```

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## Common Development Tasks

### Add a New Search Filter
1. Update the search API in `backend/src/routes/search.js`
2. Modify the search form in `frontend/src/pages/Home.js`
3. Filter results in `frontend/src/pages/SearchResults.js`
4. Test with curl or Postman

### Add a New User Role
1. Create new model in `backend/src/models/`
2. Add authentication in `backend/src/routes/auth.js`
3. Create login page in `frontend/src/pages/`
4. Add role to JWT payload in auth route
5. Protect routes with middleware

### Enable Notifications
1. Replace Message polling with WebSockets (Socket.io)
2. Update backend to use `socket.io` package
3. Connect frontend with Socket.io client
4. Emit/listen for chat messages in real-time

---

## Security Best Practices

- ✅ **Passwords**: Bcrypt hashed, never stored plain text
- ✅ **Tokens**: JWT signed with secret, 7-day expiry
- ✅ **HTTPS**: Always use HTTPS in production
- ✅ **CORS**: Frontend URL whitelisted in backend
- ✅ **Secrets**: `.env` file in `.gitignore`, never committed
- ✅ **Rate Limiting**: Consider adding `express-rate-limit` for prod
- ✅ **Input Validation**: Joi schemas on all API endpoints
- ✅ **Security Headers**: Helmet middleware enabled

---

## Performance Optimization

- **Database Indexing**: Add indexes on frequently queried fields (email, userId)
- **Caching**: Implement Redis for search results
- **Pagination**: Add limit/offset to search and booking endpoints
- **CDN**: Serve frontend from CDN (Vercel includes this)
- **Compression**: Enable gzip compression in Express

---

## Future Enhancements

- [ ] Payment integration (Stripe/Razorpay)
- [ ] Email receipts and invoice generation
- [ ] SMS notifications (Twilio)
- [ ] Mobile app (React Native)
- [ ] Advanced filtering (price range, ratings)
- [ ] Booking cancellation and refunds
- [ ] Vendor reviews and ratings
- [ ] Loyalty points/rewards
- [ ] Multi-language support
- [ ] Dark mode UI

---

## License

MIT License — See LICENSE file for details.

---

## Support & Contact

For issues or questions:
- Open an issue on GitHub: https://github.com/Siddhant818/Travel-app/issues
- Email: your-email@example.com
- Discord/Slack community: [link]

---

**Last Updated**: May 2026 | **Version**: 1.0.0
