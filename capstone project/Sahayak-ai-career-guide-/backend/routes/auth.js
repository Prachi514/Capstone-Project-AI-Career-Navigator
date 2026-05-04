// server/routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');
const nodemailer = require('nodemailer');
const User = require('../models/User');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';
const BlacklistedToken = require('../models/BlacklistedToken');
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

const SignupToken = require('../models/SignupToken');
const auth = require('../middleware/auth');

// Email configuration (using Gmail or similar SMTP service)
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASSWORD || ''
  }
});

// HELPER: basic email validation
const isEmail = (s) => /^\S+@\S+\.\S+$/.test(s);

/**
 * POST /api/auth/signup
 * Body: { name, email, password }
 * Registers user as 'student' by default.
 */
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });
    if (!isEmail(email)) return res.status(400).json({ message: 'Invalid email' });
    if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = new User({ name: name.trim(), email: email.toLowerCase().trim(), password: hash, userType: 'student' });
    await user.save();

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, userType: user.userType, createdAt: user.createdAt }
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * POST /api/auth/signup-init
 * Body: { name, email, password }
 * Generates OTP, stores a temporary signup token and sends OTP to email
 */
router.post('/signup-init', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });
    if (!isEmail(email)) return res.status(400).json({ message: 'Invalid email' });
    if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });

    const exists = await User.findOne({ email: email.toLowerCase().trim() });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    // create password hash to store temporarily
    const salt = await bcrypt.genSalt(10);
    const pwdHash = await bcrypt.hash(password, salt);

    // generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = crypto.createHash('sha256').update(otp).digest('hex');
    const expiry = new Date(Date.now() + 1000 * 60 * 15); // 15 minutes

    // upsert signup token
    await SignupToken.updateOne({ email: email.toLowerCase().trim() }, {
      name: name.trim(), email: email.toLowerCase().trim(), passwordHash: pwdHash, otpHash, otpExpiry: expiry
    }, { upsert: true });

    // send OTP email
    const mailOptions = {
      from: process.env.EMAIL_USER || '',
      to: email,
      subject: 'Your Sahayak verification code',
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2>Your verification code</h2>
          <p>Hi ${name},</p>
          <p>Your verification code is <strong style="font-size: 20px">${otp}</strong>. It expires in 15 minutes.</p>
          <p>If you did not request this, please ignore this email.</p>
          <p>Best regards,<br/>Manzil Team</p>
        </div>
      `
    };
    await transporter.sendMail(mailOptions);

    return res.json({ message: 'OTP sent to email' });
  } catch (err) {
    console.error('signup-init error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

/**
 * POST /api/auth/signup-resend
 * Body: { email }
 * Resends a new OTP if a signup token exists for the email
 */
router.post('/signup-resend', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Missing email' });

    const tokenDoc = await SignupToken.findOne({ email: email.toLowerCase().trim() });
    if (!tokenDoc) return res.status(400).json({ message: 'No pending signup found for this email' });

    // generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = crypto.createHash('sha256').update(otp).digest('hex');
    const expiry = new Date(Date.now() + 1000 * 60 * 15);

    tokenDoc.otpHash = otpHash;
    tokenDoc.otpExpiry = expiry;
    await tokenDoc.save();

    const mailOptions = {
      from: process.env.EMAIL_USER || '',
      to: tokenDoc.email,
      subject: 'Your Sahayak verification code (resend)',
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2>Your verification code</h2>
          <p>Hi ${tokenDoc.name},</p>
          <p>Your new verification code is <strong style="font-size: 20px">${otp}</strong>. It expires in 15 minutes.</p>
          <p>If you did not request this, please ignore this email.</p>
          <p>Best regards,<br/>Sahayak Team</p>
        </div>
      `
    };
    await transporter.sendMail(mailOptions);
    return res.json({ message: 'OTP resent' });
  } catch (err) {
    console.error('signup-resend error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

/**
 * POST /api/auth/signup-verify
 * Body: { email, otp }
 * Verifies OTP and creates the user
 */
router.post('/signup-verify', async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: 'Missing email or otp' });

    const tokenDoc = await SignupToken.findOne({ email: email.toLowerCase().trim() });
    if (!tokenDoc) return res.status(400).json({ message: 'No pending signup for this email or OTP expired' });
    if (new Date() > tokenDoc.otpExpiry) {
      await SignupToken.deleteOne({ email: email.toLowerCase().trim() });
      return res.status(400).json({ message: 'OTP expired' });
    }

    const otpHash = crypto.createHash('sha256').update(otp).digest('hex');
    if (otpHash !== tokenDoc.otpHash) return res.status(400).json({ message: 'Invalid OTP' });

    // create user from temp token
    const user = new User({ name: tokenDoc.name, email: tokenDoc.email, password: tokenDoc.passwordHash, userType: 'student' });
    await user.save();

    // cleanup
    await SignupToken.deleteOne({ email: email.toLowerCase().trim() });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token, user: { id: user._id, name: user.name, email: user.email, userType: user.userType, createdAt: user.createdAt } });
  } catch (err) {
    console.error('signup-verify error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

/**
 * PATCH /api/auth/profile
 * Protected - updates user's profile fields (currently name)
 */
router.patch('/profile', auth, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Name is required' });

    const user = await User.findByIdAndUpdate(req.userId, { name: name.trim() }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });

    return res.json({ user: { id: user._id, name: user.name, email: user.email, userType: user.userType, createdAt: user.createdAt } });
  } catch (err) {
    console.error('Profile update error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

/**
 * POST /api/auth/login
 * Body: { email, password }
 * Returns token + user on success.
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Missing fields' });

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user: { id: user._id, name: user.name, email: user.email, userType: user.userType, createdAt: user.createdAt } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * POST /api/auth/check-email
 * Body: { email }
 * Returns { exists: boolean }
 */
router.post('/check-email', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Missing email' });
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    return res.json({ exists: !!user });
  } catch (err) {
    console.error('check-email error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

/**
 * POST /api/auth/logout
 * Header: Authorization: Bearer <token>
 * Adds token to blacklist so it cannot be used again.
 */
router.post('/logout', async (req, res) => {
  try {
    const authHeader = req.header('Authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : (req.body.token || req.query.token);
    if (!token) return res.status(400).json({ message: 'No token provided' });

    // try to decode token to get expiry
    let expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // default 7d
    try {
      const decoded = jwt.decode(token);
      if (decoded && decoded.exp) expiresAt = new Date(decoded.exp * 1000);
    } catch (e) { /* ignore */ }

    // upsert blacklist entry
    await BlacklistedToken.updateOne({ token }, { token, expiresAt }, { upsert: true });

    return res.json({ message: 'Logged out' });
  } catch (err) {
    console.error('Logout error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

/**
 * POST /api/auth/google
 * Body: { idToken }
 * Verifies Google ID token, creates or finds the user, and returns app JWT
 */
router.post('/google', async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) return res.status(400).json({ message: 'Missing idToken' });

    // Verify token with Google
    let ticket;
    try {
      ticket = await googleClient.verifyIdToken({ idToken, audience: GOOGLE_CLIENT_ID });
    } catch (err) {
      console.error('Google token verification failed', err);
      return res.status(400).json({ message: 'Invalid Google token' });
    }

    const payload = ticket.getPayload();
    const email = (payload.email || '').toLowerCase();
    const name = payload.name || payload.email || 'Google User';
    if (!email) return res.status(400).json({ message: 'Google token did not contain email' });

    // Find or create user
    let user = await User.findOne({ email });
    if (!user) {
      // password is required by schema; create a random one and hash it
      const randomPwd = crypto.randomBytes(16).toString('hex');
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(randomPwd, salt);
      user = new User({ name: name.trim(), email, password: hash, userType: 'student' });
      await user.save();
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token, user: { id: user._id, name: user.name, email: user.email, userType: user.userType, createdAt: user.createdAt } });
  } catch (err) {
    console.error('Google SSO error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

/**
 * POST /api/auth/forgot-password
 * Body: { email }
 * Sends password reset link to user's email
 */
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(400).json({ message: 'If an account with this email exists, you will receive a password reset link' });

    // Generate reset token (valid for 1 hour)
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    const expiresIn = Date.now() + 60 * 60 * 1000; // 1 hour

    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpiry = expiresIn;
    await user.save();

    // Create reset link (adjust frontend URL as needed)
    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5174'}/reset-password/${resetToken}`;

    // Send email
    const mailOptions = {
      from: process.env.EMAIL_USER || '',
      to: user.email,
      subject: 'Password Reset Request - Sahayak',
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2>Password Reset Request</h2>
          <p>Hi ${user.name},</p>
          <p>You requested a password reset. Click the link below to reset your password (valid for 1 hour):</p>
          <p><a href="${resetLink}" style="color: #0066cc; text-decoration: none;"><button style="background-color: #0066cc; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">Reset Password</button></a></p>
          <p>Or copy this link: <a href="${resetLink}">${resetLink}</a></p>
          <p>If you did not request this, please ignore this email.</p>
          <p>Best regards,<br/>Sahayak Team</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return res.json({ message: 'Password reset link sent to your email (if account exists)' });
  } catch (err) {
    console.error('Forgot password error:', err);
    return res.status(500).json({ message: 'Server error. Could not send reset email.' });
  }
});

/**
 * POST /api/auth/reset-password
 * Body: { token, newPassword }
 * Verifies reset token and updates user password
 */
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) return res.status(400).json({ message: 'Missing token or password' });
    if (newPassword.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });

    // Hash the token to compare with stored hash
    const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with valid reset token
    const user = await User.findOne({
      resetPasswordToken: resetTokenHash,
      resetPasswordExpiry: { $gt: Date.now() } // Token must not be expired
    });

    if (!user) return res.status(400).json({ message: 'Invalid or expired reset token' });

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPassword, salt);

    // Update password and clear reset fields
    user.password = hash;
    user.resetPasswordToken = null;
    user.resetPasswordExpiry = null;
    await user.save();

    // Send confirmation email
    const mailOptions = {
      from: process.env.EMAIL_USER || '',
      to: user.email,
      subject: 'Password Changed Successfully - Sahayak',
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2>Password Changed</h2>
          <p>Hi ${user.name},</p>
          <p>Your password has been successfully changed. You can now log in with your new password.</p>
          <p>If you did not make this change, please contact support immediately.</p>
          <p>Best regards,<br/>Sahayak Team</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return res.json({ message: 'Password reset successfully' });
  } catch (err) {
    console.error('Reset password error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/auth/profile - return current user's profile (protected)
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password -resetPasswordToken -resetPasswordExpiry');
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json({ user: { id: user._id, name: user.name, email: user.email, userType: user.userType, createdAt: user.createdAt } });
  } catch (err) {
    console.error('Get profile error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

