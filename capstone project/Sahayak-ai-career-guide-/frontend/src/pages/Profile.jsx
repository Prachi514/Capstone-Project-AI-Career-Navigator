import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineArrowLeft, HiOutlinePencil, HiOutlineCheck, HiOutlineX, HiOutlineMail, HiOutlineCalendar } from 'react-icons/hi';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [editingName, setEditingName] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [attempts, setAttempts] = useState([]);

  useEffect(() => {
    // Try fetching profile from backend (if available), otherwise fall back to localStorage
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      const storedName = localStorage.getItem('userName');
      const storedEmail = localStorage.getItem('userEmail');
      const storedCreatedAt = localStorage.getItem('userCreatedAt');

      if (token) {
        try {
          const res = await fetch('/api/auth/profile', { headers: { Authorization: `Bearer ${token}` } });
          if (res.ok) {
            const data = await res.json();
            const u = data.user || data;
            setUser({
              name: u.name || storedName || 'User',
              email: u.email || storedEmail || 'No email',
              userType: u.userType || 'Student',
              joinedDate: u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Not available'
            });
            setEditingName(u.name || storedName || '');
            setLoading(false);
            return;
          }
        } catch (e) {
          // ignore and fallback to localStorage
        }
      }

      // Fallback to localStorage
      if (storedName) {
        setUser({
          name: storedName,
          email: storedEmail || 'No email stored',
          userType: 'Student',
          joinedDate: storedCreatedAt ? new Date(storedCreatedAt).toLocaleDateString() : 'Not available'
        });
        setEditingName(storedName);
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchAttempts = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res = await fetch('/api/assessment/my-attempts', { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) return;
        const data = await res.json();
        setAttempts(data.attempts || []);
      } catch (err) {
        console.error('Failed to fetch attempts', err);
      }
    };

    fetchAttempts();
  }, []);

  const handleSaveName = async () => {
    if (!editingName.trim()) {
      setMessage('Name cannot be empty');
      return;
    }

    setSaving(true);
    setMessage('');
    const token = localStorage.getItem('token');

    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({ name: editingName })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update profile');

      setUser({ ...user, name: data.user.name });
      localStorage.setItem('userName', data.user.name);
      setMessage('Profile updated successfully');
      setEditing(false);
      setTimeout(() => setMessage(''), 2000);
    } catch (err) {
      console.error('Profile update error:', err);
      setMessage(err.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditingName(user?.name || '');
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600">Loading profile...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-red-600">{error || 'Failed to load profile'}</div>
      </div>
    );
  }

  const userInitials = (user.name || 'U').split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <div className=" bg-linear-to-br from-indigo-50 to-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700"
          >
            <HiOutlineArrowLeft size={20} />
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        </div>

        {/* Profile Card */}
        <div className="rounded-2xl shadow-lg overflow-hidden bg-white">
          <div className="p-8 md:p-10 flex flex-col md:flex-row gap-8 items-start">
            {/* Avatar & Basic */}
            <div className="shrink-0">
              <div className="w-28 h-28 rounded-full bg-linear-to-br from-indigo-500 to-pink-500 text-white flex items-center justify-center text-3xl font-bold shadow-lg">{userInitials}</div>
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between gap-4">
                <div>
                  {editing ? (
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="text-2xl font-semibold bg-gray-50 border-2 border-indigo-500 rounded px-3 py-2 text-gray-900"
                    />
                  ) : (
                    <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                  )}
                  <p className="text-sm text-gray-600 mt-1">{user.userType}</p>
                </div>

                <div className="flex items-center gap-3">
                  {!editing ? (
                    <button onClick={() => setEditing(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-medium">
                      <HiOutlinePencil />
                      <span className="hidden md:inline">Edit</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button onClick={handleSaveName} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white font-medium">
                        <HiOutlineCheck />
                        {saving ? 'Saving...' : 'Save'}
                      </button>
                      <button onClick={handleCancel} className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700 font-medium">
                        <HiOutlineX />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4">
                <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                  <div className="flex items-center gap-3 text-gray-700">
                    <HiOutlineMail className="text-indigo-600 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xs text-gray-500">Email</div>
                      <div className="text-sm text-gray-900 truncate font-medium">{user.email}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                  <div className="flex items-center gap-3 text-gray-700">
                    <HiOutlineCalendar className="text-indigo-600 shrink-0" />
                    <div>
                      <div className="text-xs text-gray-500">Account Type</div>
                      <div className="text-sm text-gray-900 font-medium">{user.userType}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                  <div className="flex items-center gap-3 text-gray-700">
                    <HiOutlineCalendar className="text-indigo-600 shrink-0" />
                    <div>
                      <div className="text-xs text-gray-500">Member Since</div>
                      <div className="text-sm text-gray-900 font-medium">{user.joinedDate}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Attempts List */}
              {/* <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">My Test Attempts</h3>
                {attempts.length === 0 ? (
                  <div className="text-sm text-gray-600">No attempts recorded yet.</div>
                ) : (
                  <div className="space-y-4">
                    {attempts.map((a, idx) => (
                      <div key={idx} className="p-4 border rounded-lg bg-white">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm text-gray-500">{new Date(a.date).toLocaleString()}</div>
                            <div className="text-md font-semibold">Class: {a.class || 'N/A'}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold">{a.correct}/{a.totalQuestions}</div>
                            <div className="text-sm text-gray-500">{Number(a.percentage).toFixed(2)}%</div>
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-gray-600">Time Spent: {a.timeSpent ? `${Math.floor(a.timeSpent/60)}m ${a.timeSpent%60}s` : 'N/A'}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div> */}

              {message && (
                <div className={`mt-6 p-3 rounded-lg text-sm font-medium ${message.includes('successfully') ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
                  {message}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
