// src/pages/Signup.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// When using OTP signup, we call /api/auth/signup-init and then navigate to verification page
import GoogleSignIn from '../components/GoogleSignIn';

export default function Signup({ setToken }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [emailExists, setEmailExists] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [accepted, setAccepted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const validate = () => {
    const { name, email, password, confirmPassword } = formData;
    if (!name || !email || !password || !confirmPassword) return 'Please fill in all fields.';
    if (!/^\S+@\S+\.\S+$/.test(email)) return 'Please enter a valid email address.';
    if (emailExists) return 'Email already registered.';
    if (password.length < 6) return 'Password must be at least 6 characters.';
    if (password !== confirmPassword) return 'Passwords do not match.';
    if (!accepted) return 'Please accept the Terms of Service.';
    return null;
  };

  const checkEmail = async (value) => {
    const email = (value || '').trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setEmailExists(false);
      return;
    }
    setCheckingEmail(true);
    try {
      const res = await fetch('/api/auth/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (res.ok) {
        const data = await res.json();
        setEmailExists(!!data.exists);
      } else {
        setEmailExists(false);
      }
    } catch (err) {
      setEmailExists(false);
    } finally {
      setCheckingEmail(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const v = validate();
    if (v) { setError(v); return; }

    setLoading(true);
    try {
      // Start OTP signup flow: send OTP to email and save temp token on server
      const res = await fetch('/api/auth/signup-init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Signup init failed');

      // Navigate to OTP verification page where user can enter the code
      setLoading(false);
      navigate(`/verify-signup?email=${encodeURIComponent(formData.email.trim().toLowerCase())}`);
    } catch (err) {
      console.error('Signup init error:', err);
      setError(err.message || 'Failed to start signup');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-linear-to-b from-pink-50 via-white to-indigo-50">
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
        <div className="max-w-6xl w-full rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        {/* Left marketing */}
        <div className="hidden lg:flex flex-col gap-6 justify-center p-12 bg-linear-to-br from-indigo-600 to-pink-500 text-white">
          <div>
            <div className="text-4xl font-extrabold leading-tight">Join Manzil</div>
            <p className="mt-2 text-indigo-100 max-w-sm">Create your free account to find colleges, build a personalized roadmap, and get targeted resources.</p>
          </div>

          <div className="mt-6 bg-white/10 rounded-xl p-4 max-w-sm">
            <div className="text-sm font-semibold">Why students choose Manzil</div>
            <ul className="mt-2 text-sm space-y-2 opacity-90">
              <li>• Personalized career matches</li>
              <li>• College explorer with filters</li>
              <li>• Prep hub & mock interviews</li>
            </ul>
            <div className="mt-4">
              <Link to="/login" className="inline-block px-4 py-2 rounded-full bg-white text-pink-600 font-semibold">I already have an account</Link>
            </div>
          </div>

          <div className="mt-auto text-sm opacity-90">
            <small>Trusted by students • 4.8 ★</small>
          </div>
        </div>

        {/* Right - form */}
        <div className="bg-white p-8 md:p-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-pink-600">Create your account</h2>
            <p className="text-sm text-gray-600 mt-1">Get personalized college & career recommendations.</p>
          </div>

          {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md border border-red-200">{error}</div>}

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-200 outline-none"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={(e) => checkEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-200 outline-none"
                placeholder="you@example.com"
              />
              {checkingEmail && <div className="text-xs text-gray-500 mt-1">Checking email…</div>}
              {emailExists && !checkingEmail && (
                <div className="text-xs text-red-600 mt-1">This email is already registered.</div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPwd ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-200 outline-none"
                    placeholder="Create a password"
                  />
                  <button type="button" onClick={() => setShowPwd(s => !s)} className="absolute right-3 top-2 text-sm text-gray-500">
                    {showPwd ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm</label>
                <input
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-200 outline-none"
                  placeholder="Repeat password"
                />
              </div>
            </div>

            {/* TERMS */}
            <div className="flex items-start gap-3">
              <input id="terms" type="checkbox" checked={accepted} onChange={() => setAccepted(s => !s)} className="w-4 h-4 mt-1" />
              <label htmlFor="terms" className="text-sm text-gray-600">
                I agree to the{' '}
                <a href="#" className="text-pink-600 font-medium">Terms of Service</a> and <a href="#" className="text-pink-600 font-medium">Privacy Policy</a>.
              </label>
            </div>

            <button disabled={loading} type="submit" className="w-full py-3 rounded-full bg-linear-to-r from-pink-500 to-indigo-600 text-white font-semibold shadow">
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <div className="mt-4">
            <GoogleSignIn setToken={setToken} />
          </div>

          <div className="mt-5 text-center text-sm text-gray-600">
            Already have an account? <Link to="/login" className="text-pink-600 font-semibold">Login</Link>
          </div>
        </div>
      </div>
        </div>
    </div>
  );
}
