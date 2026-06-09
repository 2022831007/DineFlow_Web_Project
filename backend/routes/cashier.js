const express = require('express');
const router = express.Router();
const { getCashierStats, getCashierOrders, getRecentOrders, updateOrderStatus, generateBill } = require('../controllers/cashierController');

// GET /api/cashier/stats
router.get('/stats', getCashierStats);

// GET /api/cashier/orders
router.get('/orders', getCashierOrders);

// GET /api/cashier/recent-orders
router.get('/recent-orders', getRecentOrders);

// PUT /api/cashier/orders/:id/status
router.put('/orders/:id/status', updateOrderStatus);

// POST /api/cashier/generate-bill
router.post('/generate-bill', generateBill);

module.exports = router;
