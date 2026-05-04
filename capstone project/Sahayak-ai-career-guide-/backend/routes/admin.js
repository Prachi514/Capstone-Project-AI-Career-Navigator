const express = require('express');
const User = require('../models/User');

const router = express.Router();
const Attempt = require('../models/Attempt');

// Admin credentials (hardcoded for this project)
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'Rittu@17';

/**
 * POST /api/admin/login
 * Body: { username, password }
 * Returns token on success
 */
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate hardcoded credentials
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // Generate a simple token for admin session
      const adminToken = Buffer.from(`admin:${Date.now()}`).toString('base64');
      
      res.json({
        success: true,
        token: adminToken,
        message: 'Admin login successful'
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }
  } catch (err) {
    console.error('Admin login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * GET /api/admin/students
 * Get all students from database
 * Query params: search, sort
 */
router.get('/students', async (req, res) => {
  try {
    const { search = '' } = req.query;

    // Build query
    let query = { userType: 'student' };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Fetch students
    const students = await User.find(query)
      .select('name email createdAt userType')
      .sort({ createdAt: -1 });

    // Count attempts per student (in Attempt collection) in parallel
    const counts = await Promise.all(students.map(s => Attempt.countDocuments({ user: s._id })));

    const studentsWithCounts = students.map((s, idx) => ({
      ...s.toObject(),
      attemptsCount: counts[idx] || 0
    }));

    res.json({
      success: true,
      count: studentsWithCounts.length,
      students: studentsWithCounts
    });
  } catch (err) {
    console.error('Fetch students error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * GET /api/admin/stats
 * Get admin dashboard statistics
 */
router.get('/stats', async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ userType: 'student' });
    const studentsToday = await User.countDocuments({
      userType: 'student',
      createdAt: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0))
      }
    });

    res.json({
      success: true,
      totalStudents,
      studentsToday,
      timestamp: new Date()
    });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
