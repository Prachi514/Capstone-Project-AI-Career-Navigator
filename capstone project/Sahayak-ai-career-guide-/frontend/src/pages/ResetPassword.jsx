import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

export default function ResetPassword() {
  const navigate = useNavigate();
  const { token } = useParams();
  const [manualToken, setManualToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!password || !confirmPassword) {
      setError('Please fill in both password fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const usedToken = token || manualToken;
      if (!usedToken) {
        setError('Missing reset token. Please use the link from your email or paste the token below.');
        setLoading(false);
        return;
      }

      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: usedToken, newPassword: password })
      });

      // Log for debugging
      console.log('Reset response status:', res.status);
      const data = await res.json().catch(() => null);
      console.log('Reset response body:', data);

      if (!res.ok) {
        const msg = (data && data.message) ? data.message : `Server returned ${res.status}`;
        throw new Error(msg);
      }

      setSuccess(true);
      setMessage(data?.message || 'Password reset successfully!');
      setLoading(false);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      console.error('Reset password error:', err);
      setError(err.message || 'Failed to reset password. Please check your link and try again.');
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex flex-col bg-linear-to-b from-indigo-50 to-white">
        <nav className="z-30 bg-white/80 backdrop-blur-md border-b sticky top-0">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link to="/" className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-linear-to-tr from-indigo-600 to-pink-500 text-white flex items-center justify-center font-bold shadow-lg">S</div>
                <span className="font-bold text-lg">Manzil</span>
              </Link>
            </div>
          </div>
        </nav>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 font-semibold mb-4">Invalid password reset link.</p>
            <Link to="/login" className="text-indigo-600 font-semibold hover:underline">Back to Login</Link>
          </div>
        </div>
      </div>
    );
  }

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
            <h2 className="text-2xl font-bold text-indigo-600">Reset Password</h2>
            <p className="text-sm text-gray-600 mt-1">Enter your new password below.</p>
          </div>

          {success ? (
            <div className="text-center">
              <div className="mb-4 p-4 bg-green-50 text-green-800 rounded border border-green-200">
                <p className="font-semibold">✓ {message}</p>
                <p className="text-sm mt-2">Redirecting to login...</p>
              </div>
            </div>
          ) : (
            <>
              {error && <div className="mb-4 p-3 bg-red-100 text-red-800 rounded border border-red-200">{error}</div>}

              {/* Manual token input for debugging / broken links */}
              

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-300 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2 text-sm text-gray-500"
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-300 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-full bg-linear-to-r from-indigo-600 to-pink-500 text-white font-semibold shadow hover:shadow-lg disabled:opacity-50"
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
              </form>

              <div className="mt-4 text-center text-sm text-gray-600">
                <Link to="/login" className="text-indigo-600 font-semibold hover:underline">Back to Login</Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
