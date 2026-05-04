// server/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true }, // hashed
  userType: { type: String, enum: ['student'], default: 'student' }, // only 'student'
  resetPasswordToken: { type: String, default: null }, // temporary token for password reset
  resetPasswordExpiry: { type: Date, default: null }, // expiry of reset token
  createdAt: { type: Date, default: Date.now },
  // Store quiz/assessment attempts for the user
  attempts: [{
    date: { type: Date, default: Date.now },
    class: { type: String },
    totalQuestions: { type: Number },
    correct: { type: Number },
    wrong: { type: Number },
    percentage: { type: Number },
    timeSpent: { type: Number }, // seconds
    answers: { type: Object, default: {} },
    // optional: store the full question payload so analysis can be shown later
    questions: { type: Array, default: [] }
  }]
});

module.exports = mongoose.model('User', userSchema);
