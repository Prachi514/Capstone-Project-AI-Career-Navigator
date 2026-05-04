const mongoose = require('mongoose');

const signupTokenSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, lowercase: true, trim: true, index: true },
  passwordHash: { type: String, required: true },
  otpHash: { type: String, required: true },
  otpExpiry: { type: Date, required: true, index: { expires: 60 * 15 } }, // TTL ~15 minutes
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SignupToken', signupTokenSchema);
