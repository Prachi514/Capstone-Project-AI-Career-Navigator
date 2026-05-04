import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({ totalStudents: 0, studentsToday: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if admin token exists
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      navigate('/admin-login', { replace: true });
      return;
    }

    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch students
      const studentsRes = await fetch('/api/admin/students');
      const studentsData = await studentsRes.json();
      
      if (studentsData.success) {
        setStudents(studentsData.students);
        setFilteredStudents(studentsData.students);
      }

      // Fetch stats
      const statsRes = await fetch('/api/admin/stats');
      const statsData = await statsRes.json();
      
      if (statsData.success) {
        setStats({
          totalStudents: statsData.totalStudents,
          studentsToday: statsData.studentsToday
        });
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (!term) {
      setFilteredStudents(students);
    } else {
      const filtered = students.filter(student =>
        student.name.toLowerCase().includes(term) ||
        student.email.toLowerCase().includes(term)
      );
      setFilteredStudents(filtered);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('isAdmin');
    // Trigger event to update App.jsx state
    window.dispatchEvent(new Event('tokenUpdated'));
    navigate('/admin-login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-purple-50">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-200 border-b border-indigo-200 shadow-2xl" style={{boxShadow: '0 20px 40px rgba(79, 70, 229, 0.3)'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-4xl bg-white/20 p-3 rounded-xl backdrop-blur-sm">👨‍💼</div>
            <div>
              <h1 className="text-3xl font-bold text-white drop-shadow-lg">Admin Dashboard</h1>
              <p className="text-blue-100 text-sm">Manzil Student Management</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-2 bg-red-500/90 hover:bg-red-600 text-white rounded-xl transition font-semibold shadow-lg hover:shadow-xl" style={{boxShadow: '0 8px 20px rgba(239, 68, 68, 0.4)'}}
          >
            <span>🚪</span>
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-600 to-blue-300 rounded-2xl p-6 text-white hover:scale-105 transition duration-300" style={{boxShadow: '0 15px 35px rgba(59, 130, 246, 0.4)'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-semibold">Total Students</p>
                <p className="text-5xl font-bold mt-2">{stats.totalStudents}</p>
                <p className="text-blue-200 text-xs mt-2">Registered in database</p>
              </div>
              <span className="text-6xl opacity-40">👥</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-600 to-green-400 rounded-2xl p-6 text-white hover:scale-105 transition duration-300" style={{boxShadow: '0 15px 35px rgba(34, 197, 94, 0.4)'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm font-semibold">Joined Today</p>
                <p className="text-5xl font-bold mt-2">{stats.studentsToday}</p>
                <p className="text-emerald-200 text-xs mt-2">New registrations</p>
              </div>
              <span className="text-6xl opacity-40">✨</span>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-2xl p-6 mb-8 backdrop-blur-sm" style={{boxShadow: '0 10px 30px rgba(99, 102, 241, 0.15)'}}>
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">🔍</span>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={handleSearch}
              className="flex-1 px-4 py-3 border-2 border-indigo-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gradient-to-r from-indigo-50 to-purple-50"
            />
            <span className="text-sm font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-2 rounded-xl shadow-lg">
              {filteredStudents.length} results
            </span>
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-2xl overflow-hidden backdrop-blur-sm" style={{boxShadow: '0 20px 40px rgba(79, 70, 229, 0.15)'}}>
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                <p className="mt-4 text-gray-600">Loading students...</p>
              </div>
            </div>
          ) : filteredStudents.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold">#</th>
                    <th className="px-6 py-4 text-left text-sm font-bold">Student Name</th>
                    <th className="px-6 py-4 text-left text-sm font-bold">Email Address</th>
                    <th className="px-6 py-4 text-left text-sm font-bold">Tests Attempted</th>
                    <th className="px-6 py-4 text-left text-sm font-bold">Joined Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-indigo-100">
                  {filteredStudents.map((student, index) => (
                    <tr key={student._id} className="hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white font-bold text-sm shadow-md">
                          {index + 1}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold">
                            {student.name.substring(0, 1).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{student.name}</p>
                            <p className="text-xs text-gray-500">{student.userType}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span>📧</span>
                          {student.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-800">{student.attemptsCount ?? 0}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span>📅</span>
                          {new Date(student.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <span className="text-6xl block mb-4">👥</span>
                <p className="text-gray-600 font-semibold">No students found</p>
                <p className="text-gray-500 text-sm mt-2">Try adjusting your search</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center py-6 rounded-2xl bg-gradient-to-r from-gray-800 via-gray-800 to-gray-800" style={{boxShadow: '0 8px 20px rgba(99, 102, 241, 0.15)'}}>
          {/* <p className="text-gray-700 text-sm font-semibold">Last updated: <span className="text-indigo-600 font-bold">{new Date().toLocaleTimeString()}</span></p> */}
          <p className="text-xm text-white mt-2">Manzil Admin Dashboard © 2026</p>
        </div>
      </div>
    </div>
  );
}


