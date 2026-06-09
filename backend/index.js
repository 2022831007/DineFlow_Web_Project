const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ======================
// Middleware
// ======================
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// ======================
// Routes
// ======================
app.use('/api/auth', require('./routes/auth'));
app.use('/api/menu', require('./routes/menu'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/reviews', require('./routes/reviews'));

// DineFlow Restaurant Routes
app.use('/api/tables', require('./routes/tables'));
app.use('/api/dine-orders', require('./routes/dineOrders'));
app.use('/api/kitchen', require('./routes/kitchen'));

// ======================
// Home Route
// ======================
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🍔 DineFlow API is running!',
    version: '1.0.0'
  });
});

// ======================
// 404 Route Handler
// ======================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found.'
  });
});

// ======================
// Server Start
// ======================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 DineFlow server running on http://localhost:${PORT}`);
});