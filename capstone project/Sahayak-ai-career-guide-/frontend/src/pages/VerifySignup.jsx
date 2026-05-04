import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function VerifySignup({ setToken }) {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const emailFromQuery = params.get('email') || '';

  const [email] = useState(emailFromQuery);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !otp) { setError('Please enter both email and OTP'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/signup-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Verification failed');

      localStorage.setItem('token', data.token);
      localStorage.setItem('userName', data.user.name || data.user.email.split('@')[0]);
      localStorage.setItem('userEmail', data.user.email);
      if (data.user.createdAt) localStorage.setItem('userCreatedAt', data.user.createdAt);
      setToken?.(data.token);
      window.dispatchEvent(new Event('tokenUpdated'));
      navigate('/dashboard');
    } catch (err) {
      console.error('Verify signup error:', err);
      setError(err.message || 'Failed to verify');
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) { setError('Please provide email to resend OTP'); return; }
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/signup-resend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Resend failed');
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to resend OTP');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-2">Verify your email</h2>
        <p className="text-sm text-gray-600 mb-4">Enter the 6-digit code we sent to your email.</p>
        {error && <div className="mb-3 p-2 bg-red-50 text-red-700 rounded">{error}</div>}
        <form onSubmit={handleVerify} className="space-y-3">
          <div>
            <label className="text-sm text-gray-700">Email</label>
            <input value={email} disabled className="w-full px-3 py-2 border rounded bg-gray-100 text-gray-700" />
          </div>
          <div>
            <label className="text-sm text-gray-700">OTP</label>
            <input value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full px-3 py-2 border rounded" />
          </div>
          <button disabled={loading} className="w-full py-2 bg-indigo-600 text-white rounded">{loading ? 'Verifying...' : 'Verify'}</button>
        </form>
        <div className="mt-3 text-sm text-gray-600">Didn't receive the code? <button onClick={handleResend} className="text-indigo-600 underline">Resend</button></div>
      </div>
    </div>
  );
}
