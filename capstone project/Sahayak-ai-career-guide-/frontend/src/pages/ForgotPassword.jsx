import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Request failed');

      setMessage(data.message || 'If an account with this email exists, you will receive a password reset link.');
      setSubmitted(true);
      setLoading(false);
    } catch (err) {
      console.error('Forgot password error:', err.message);
      setError(err.message || 'Failed to send reset link. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-linear-to-b from-indigo-50 to-white">
      {/* Navbar */}
      <nav className="z-30 bg-white/80 backdrop-blur-md border-b sticky top-0">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-linear-to-tr from-indigo-600 to-pink-500 text-white flex items-center justify-center font-bold shadow-lg">S</div>
              <span className="font-bold text-lg">Manzil</span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link to="/" className="px-4 py-2 rounded-md bg-linear-to-r from-black to-gray-800 text-white shadow-md">Home</Link>
              <Link to="/login" className="px-4 py-2 rounded-md bg-linear-to-r from-indigo-600 to-pink-500 text-white shadow-md">Login</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-indigo-600">Forgot Password?</h2>
            <p className="text-sm text-gray-600 mt-1">Enter your email address and we'll send you a link to reset your password.</p>
          </div>

          {!submitted ? (
            <>
              {error && <div className="mb-4 p-3 bg-red-100 text-red-800 rounded border border-red-200">{error}</div>}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-300 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-full bg-linear-to-r from-indigo-600 to-pink-500 text-white font-semibold shadow hover:shadow-lg disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>

              <div className="mt-4 text-center text-sm text-gray-600">
                Remember your password? <Link to="/login" className="text-indigo-600 font-semibold hover:underline">Back to Login</Link>
              </div>
            </>
          ) : (
            <div className="text-center">
              <div className="mb-4 p-4 bg-green-50 text-green-800 rounded border border-green-200">
                <p className="font-semibold">Check Your Email</p>
                <p className="text-sm mt-2">{message}</p>
              </div>
              <p className="text-sm text-gray-600 mb-4">The reset link will expire in 1 hour.</p>
              <Link to="/login" className="text-indigo-600 font-semibold hover:underline">Back to Login</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
