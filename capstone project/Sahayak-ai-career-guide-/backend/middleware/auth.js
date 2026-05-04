// server/middleware/auth.js
const jwt = require('jsonwebtoken');
const BlacklistedToken = require('../models/BlacklistedToken');
const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

module.exports = async (req, res, next) => {
  const authHeader = req.header('Authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : (req.body.token || req.query.token);
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    // Check blacklist
    const exists = await BlacklistedToken.findOne({ token });
    if (exists) return res.status(401).json({ message: 'Token has been revoked' });

    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token is not valid' });
  }
};
