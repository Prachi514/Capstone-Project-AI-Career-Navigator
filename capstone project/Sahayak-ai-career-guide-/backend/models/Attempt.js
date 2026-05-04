const mongoose = require('mongoose');

const attemptSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  class: { type: String },
  totalQuestions: { type: Number },
  correct: { type: Number },
  wrong: { type: Number },
  percentage: { type: Number },
  timeSpent: { type: Number },
  answers: { type: Object, default: {} },
  questions: { type: Array, default: [] }
});

module.exports = mongoose.model('Attempt', attemptSchema);
