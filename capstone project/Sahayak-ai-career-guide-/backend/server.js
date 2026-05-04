// server/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/auth');
const assessmentRoutes = require('./routes/assessment');
const adminRoutes = require('./routes/admin');
const chatRoutes = require('./routes/chat');

const app = express();
// Configure helmet with a relaxed Cross-Origin-Opener-Policy for local development so
// third-party scripts that use postMessage (Google Identity Services) are not blocked.
// In production you should review and tighten these headers.
app.use(helmet({
  crossOriginOpenerPolicy: false
}));
app.use(cors());
app.use(express.json());

// Rate limiter (adjust limits as needed)
const limiter = rateLimit({ windowMs: 60 * 1000, max: 100 }); // 100 requests per min
app.use(limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/assessment', assessmentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chat', chatRoutes);

// Example protected route
// const auth = require('./middleware/auth');
// app.get('/api/profile', auth, async (req, res) => { ... });

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/sahayak';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
