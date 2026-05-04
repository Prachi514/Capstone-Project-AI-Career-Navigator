import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import VerifySignup from './pages/VerifySignup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Profile from './pages/Profile';
import Assessment from './pages/Assessment';
import Attempt from './pages/Attempt';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import ChatBot from './components/Chatbot';



// Protected route component
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
}

export default function App(){
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken'));

  useEffect(() => {
    // Listen for storage changes (when token is set in another tab/window)
    const handleStorageChange = () => {
      setToken(localStorage.getItem('token'));
      setAdminToken(localStorage.getItem('adminToken'));
    };

    // Listen for custom event when token changes in same tab
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('tokenUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('tokenUpdated', handleStorageChange);
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Admin routes - accessible if admin token exists */}
        <Route 
          path="/admin" 
          element={
            adminToken ? (
              <>
                <AdminDashboard />
                <ChatBot />
              </>
            ) : (
              <Navigate to="/admin-login" replace />
            )
          } 
        />
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* Student routes - accessible if student token exists */}
        <Route 
          path="/dashboard" 
          element={
            token ? (
              <>
                <div className="min-h-screen flex bg-gray-100">
                  <Sidebar />
                  <div className="flex-1 flex flex-col">
                    <Topbar />
                    <main className="flex-1 overflow-y-auto p-4 md:p-6">
                      <Dashboard />
                    </main>
                  </div>
                </div>
                <ChatBot />
              </>
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />

        <Route 
          path="/profile" 
          element={
            token ? (
              <>
                <div className="min-h-screen flex bg-gray-100">
                  <Sidebar />
                  <div className="flex-1 flex flex-col">
                    <Topbar />
                    <main className="flex-1 overflow-y-auto p-4 md:p-6">
                      <Profile />
                    </main>
                  </div>
                </div>
                <ChatBot />
              </>
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />

        <Route 
          path="/assessment" 
          element={
            token ? (
              <>
                <div className="min-h-screen flex bg-gray-100">
                  <Sidebar />
                  <div className="flex-1 flex flex-col">
                    <Topbar />
                    <main className="flex-1 overflow-y-auto p-4 md:p-6">
                      <Assessment />
                    </main>
                  </div>
                </div>
                <ChatBot />
              </>
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />

        <Route 
          path="/attempts/:id"
          element={
            token ? (
              <>
                <div className="min-h-screen flex bg-gray-100">
                  <Sidebar />
                  <div className="flex-1 flex flex-col">
                    <Topbar />
                    <main className="flex-1 overflow-y-auto p-4 md:p-6">
                      <Attempt />
                    </main>
                  </div>
                </div>
                <ChatBot />
              </>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/signup" element={<Signup setToken={setToken} />} />
        <Route path="/verify-signup" element={<VerifySignup setToken={setToken} />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

