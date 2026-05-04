import React, { useState, useRef, useEffect } from 'react';
import { HiOutlineBell, HiOutlineLogout, HiOutlineChevronDown, HiOutlineUser } from 'react-icons/hi';
import { useNavigate, Link } from 'react-router-dom';

export default function Topbar(){
  const navigate = useNavigate();
  const storedName = localStorage.getItem('userName') || 'User';
  const [userName, setUserName] = useState(storedName);
  const userInitials = (userName || 'User').split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    try {
      if (token) {
        await fetch('/api/auth/logout', { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
      }
    } catch (e) {
      // ignore
    }
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    try { window.dispatchEvent(new Event('tokenUpdated')); } catch (e) {}
    navigate('/');
  };

  useEffect(() => {
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full bg-linear-to-r from-gray-900 via-indigo-900 to-black text-white shadow-md p-3 md:p-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-3">
          
        </div>
      </div>

      <div className="flex items-center gap-4">
        

        <div className="relative" ref={ref}>
          <button onClick={() => setOpen(o => !o)} className="flex items-center gap-3 p-2 rounded-md hover:bg-white/6 transition">
            <div className="w-10 h-10 rounded-full bg-linear-to-br from-indigo-500 to-pink-500 text-white flex items-center justify-center font-semibold shadow-lg">{userInitials}</div>
            <div className="hidden md:block text-left">
              <div className="text-sm font-medium text-gray-100">{userName}</div>
              <div className="text-xs text-gray-300">Student</div>
            </div>
            <HiOutlineChevronDown className="text-gray-300" />
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-56 bg-linear-to-b from-gray-800 to-gray-900 border border-gray-700 rounded-lg shadow-2xl z-50 overflow-hidden">
              <Link to="/profile" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 border-b border-gray-700">
                <HiOutlineUser size={18} className="text-indigo-400" />
                <span className="text-sm font-medium text-gray-100">Profile</span>
              </Link>
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-rose-400 hover:bg-rose-600/10">
                <HiOutlineLogout size={18} className="text-rose-400" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
