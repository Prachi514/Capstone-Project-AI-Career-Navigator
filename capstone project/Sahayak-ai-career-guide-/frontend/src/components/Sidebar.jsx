import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { HiOutlineHome, HiOutlineBookOpen, HiOutlineSparkles, HiOutlineUser, HiOutlineLogout } from 'react-icons/hi';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [userName, setUserName] = useState(localStorage.getItem('userName') || 'User');
  const [userEmail, setUserEmail] = useState(localStorage.getItem('userEmail') || '');

  useEffect(() => {
    const sync = () => {
      setUserName(localStorage.getItem('userName') || 'User');
      setUserEmail(localStorage.getItem('userEmail') || '');
    };
    window.addEventListener('tokenUpdated', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('tokenUpdated', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { label: 'Dashboard', icon: HiOutlineHome, path: '/dashboard' },
    { label: 'Assigments', icon: HiOutlineBookOpen, path: '/assessment' },
    { label: 'Careers', icon: HiOutlineSparkles, path: '/careers' },
    { label: 'Profile', icon: HiOutlineUser, path: '/profile' },
  ];

  const userInitials = (userName || 'U').split(' ').map(n => n[0]).join('').toUpperCase();

  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    try {
      if (token) await fetch('/api/auth/logout', { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
    } catch (e) {
      // ignore
    }
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    try { window.dispatchEvent(new Event('tokenUpdated')); } catch (e) {}
    navigate('/');
  };

  return (
    <aside className="sticky top-0 hidden md:flex flex-col w-72 h-screen bg-linear-to-br from-gray-900 to-indigo-950 text-white p-5 overflow-y-auto shadow-lg">
      <div className="mb-8 flex items-center gap-3">
        <div className="w-11 h-11 rounded-lg bg-linear-to-tr from-indigo-600 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow">S</div>
        <div>
          <div className="text-lg font-semibold">Sahayak</div>
          <div className="text-xs text-gray-400">Career guide • Student-first</div>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-colors duration-150 ${
              isActive(item.path)
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-gray-300 hover:bg-white/6'
            }`}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-6 pt-4 border-t border-gray-800">
       

        <div className="mt-3 text-xs text-gray-500 px-2">© 2025 Sahayak</div>
      </div>
    </aside>
  );
}
