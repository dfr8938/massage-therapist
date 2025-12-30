// server.js
require('dotenv').config();

console.log('🔐 JWT_EXPIRES_IN:', process.env.JWT_EXPIRES_IN);
console.log('🔐 JWT_EXPIRES_IN (length):', process.env.JWT_EXPIRES_IN?.length);
console.log('🔐 JWT_EXPIRES_IN (char codes):', [...(process.env.JWT_EXPIRES_IN || '')].map(c => c.charCodeAt(0)));

const express = require('express');
const cors = require('cors');
const pg = require('pg');
const authRoutes = require('./routes/auth');
const clientRoutes = require('./routes/client');
const messageRoutes = require('./routes/messages');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL Client
const pool = new pg.Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

global.db = pool;

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/client', clientRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/admin', adminRoutes);

// Test route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Сервер запущен на порту ${PORT}`);
});

module.exports = app;
