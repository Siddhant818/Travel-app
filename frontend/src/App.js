import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import './index.css';

import Home from './pages/Home';
import CustomerSignup from './pages/CustomerSignup';
import CustomerLogin from './pages/CustomerLogin';
import VendorLogin from './pages/VendorLogin';
import SearchResults from './pages/SearchResults';
import CustomerDashboard from './pages/CustomerDashboard';
import VendorDashboard from './pages/VendorDashboard';

function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading">Loading...</div>;
  if (!user) return <Navigate to={role === 'vendor' ? '/login/vendor' : '/login/customer'} />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup/customer" element={<CustomerSignup />} />
      <Route path="/login/customer" element={<CustomerLogin />} />
      <Route path="/login/vendor" element={<VendorLogin />} />
      <Route path="/search/:type" element={<SearchResults />} />
      <Route path="/customer/dashboard" element={
        <ProtectedRoute role="customer"><CustomerDashboard /></ProtectedRoute>
      } />
      <Route path="/vendor/dashboard" element={
        <ProtectedRoute role="vendor"><VendorDashboard /></ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
