// src/pages/Login.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import GoogleSignIn from '../components/GoogleSignIn';

export default function Login({ setToken }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const [justVerifiedBanner, setJustVerifiedBanner] = useState(false);

  useEffect(() => {
    if (location && location.state && location.state.justVerified) {
      setJustVerifiedBanner(true);
      const t = setTimeout(() => setJustVerifiedBanner(false), 5000);
      return () => clearTimeout(t);
    }
  }, [location]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      // Save token + user info
      localStorage.setItem("token", data.token);
      localStorage.setItem("userName", data.user.name || data.user.email.split("@")[0]);
      localStorage.setItem("userEmail", data.user.email);
      if (data.user.createdAt) localStorage.setItem('userCreatedAt', data.user.createdAt);
      setLoading(false);
      setToken?.(data.token);
      window.dispatchEvent(new Event('tokenUpdated'));
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err.message);
      setError(err.message || "Login failed. Please check your credentials.");
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
                            
                            <Link to="/signup" className="px-4 py-2 rounded-md bg-linear-to-r from-indigo-600 to-pink-500 text-white shadow-md">Signup</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="max-w-5xl w-full rounded-2xl overflow-hidden shadow-xl grid grid-cols-1 lg:grid-cols-2">
        {/* Left - Illustration / marketing */}
        <div className="hidden lg:flex flex-col gap-6 justify-center items-start p-12 bg-linear-to-tr from-indigo-600 to-pink-500 text-white">
          <div className="text-4xl font-extrabold">Welcome back!</div>
          <p className="text-lg max-w-sm opacity-90">
            Sign in to continue with Manzil — find colleges, build a roadmap, and track your progress.
          </p>

          <div className="bg-white/20 rounded-lg p-4">
            <div className="text-sm font-semibold">New here?</div>
            <div className="text-sm opacity-90">Create an account and take a 5-minute career snapshot.</div>
            <Link to="/signup" className="mt-3 inline-block px-4 py-2 rounded-full bg-white text-pink-600 font-semibold">
              Create free account
            </Link>
          </div>

          <div className="mt-6 opacity-90">
            <small>Trusted by thousands of students • 4.8 ★ average</small>
          </div>
        </div>

        {/* Right - Form */}
        <div className="bg-white p-8 md:p-12">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-indigo-600">Manzil</h1>
            <p className="text-sm text-gray-600">Sign in to your account</p>
          </div>

          {justVerifiedBanner && (
            <div className="mb-4 p-3 bg-green-50 text-green-800 rounded">Your email was verified — please sign in.</div>
          )}

          {error && <div className="mb-4 p-3 bg-red-100 text-red-800 rounded">{error}</div>}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="you@example.com"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-300 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-300 outline-none"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" />
                <span className="text-gray-600">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-indigo-600 hover:underline">Forgot?</Link>
            </div>

            <button
              type="submit"
              className="w-full mt-2 inline-flex items-center justify-center gap-3 px-4 py-3 rounded-full bg-linear-to-r from-indigo-600 to-pink-500 text-white font-semibold shadow"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>

          <div className="mt-4">
            <GoogleSignIn setToken={setToken} />
          </div>

          <div className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="text-indigo-600 font-semibold hover:underline">Sign up</Link>
          </div>
        </div>
      </div>
        </div>
    </div>
  );
}
