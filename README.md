# ✈️ TravelApp — MakeMyTrip-style Travel Booking Platform

A full-stack travel booking app with Customer and Vendor portals.

## Tech Stack
- **Frontend**: React, React Router, Axios
- **Backend**: Node.js, Express, JWT, Bcrypt, Nodemailer

---

## 🚀 Quick Start

### 1. Backend
```bash
cd backend
npm install
npm start
# Runs on http://localhost:5000
```

### 2. Frontend (new terminal)
```bash
cd frontend
npm install
npm start
# Runs on http://localhost:3000
```

---

## 🔐 Demo Credentials

### Vendor Accounts (pre-seeded)
| Type    | Email                  | Password   |
|---------|------------------------|------------|
| ✈️ Flight | vendor@indigo.com     | password   |
| 🏨 Hotel  | vendor@taj.com        | password   |
| 🚕 Cab    | vendor@ola.com        | password   |

### Customer Accounts
- Sign up via `/signup/customer` with Email OTP

> Note: In production the OTP is emailed using SendGrid. Dev-only OTPs are shown locally when `NODE_ENV !== 'production'`.

---

## 📱 Features

### Customer
- ✅ Signup with Email OTP verification
- ✅ Login / Logout
- ✅ Search Flights (by from, to, date)
- ✅ Search Hotels (by city)
- ✅ Search Cabs (by pickup location)
- ✅ Book any service with one click
- ✅ Dashboard with booking history
- ✅ Filter bookings by status
- ✅ Real-time chat with vendor

### Vendor
- ✅ Login with company account
- ✅ View all incoming booking requests
- ✅ Accept pending bookings
- ✅ Mark accepted bookings as delivered
- ✅ Status timeline (Pending → Accepted → Delivered)
- ✅ Revenue tracking
- ✅ Real-time chat with customers
- ✅ Badge notification for pending bookings

---

## 📁 Project Structure
```
travelapp/
├── backend/
│   └── src/
│       ├── index.js          # Express server
│       ├── data/store.js     # Mock in-memory data
│       ├── middleware/auth.js # JWT middleware
│       ├── utils/otp.js      # OTP generation & email
│       └── routes/
│           ├── auth.js       # Customer/Vendor auth
│           ├── search.js     # Search endpoints
│           └── bookings.js   # Booking CRUD + chat
└── frontend/
    └── src/
        ├── App.js            # Routes
        ├── index.css         # Global styles
        ├── context/AuthContext.js
        ├── utils/api.js
        ├── components/Navbar.js
        └── pages/
            ├── Home.js           # Landing + search
            ├── CustomerSignup.js # OTP signup
            ├── CustomerLogin.js
            ├── VendorLogin.js
            ├── SearchResults.js  # Flights/Hotels/Cabs results
            ├── CustomerDashboard.js
            └── VendorDashboard.js
```

---

## 🔧 To Add Real Email OTP
In `backend/src/utils/otp.js`, replace the Nodemailer transporter with real SMTP:
```js
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: 'your@gmail.com', pass: 'your-app-password' }
});
```

## 🗄️ To Add a Real Database
Replace the `store.js` mock arrays with MongoDB (Mongoose) or PostgreSQL (Prisma) models. The route logic stays the same.

---

## 📡 Deployment & Live Links

- **Backend (Railway)**: add your `SENDGRID_API_KEY` and `SMTP_FROM` environment variables in Railway, then redeploy. Example env vars:
  - `MONGODB_URI`
  - `JWT_SECRET`
  - `SENDGRID_API_KEY` (set your SendGrid API key)
  - `SMTP_FROM` (verified sender, e.g. `noreply@yourdomain.com`)

- **Frontend (Vercel)**: set `REACT_APP_API_URL` to your backend URL (e.g. `https://your-backend.up.railway.app/api`) and redeploy.

- **Live links placeholder**:
  - Frontend: https://your-frontend.vercel.app
  - Backend API: https://your-backend.up.railway.app/api

Do NOT commit secrets to GitHub. Replace placeholders above with your actual deployed URLs and verified sender address.
