const express = require('express');
const router = express.Router();
const { getStats, getRecentOrders, getRecentReviews, getLowStock } = require('../controllers/dashboardController');

// GET /api/admin/dashboard/stats
router.get('/stats', getStats);

// GET /api/admin/dashboard/recent-orders
router.get('/recent-orders', getRecentOrders);

// GET /api/admin/dashboard/recent-reviews
router.get('/recent-reviews', getRecentReviews);

// GET /api/admin/dashboard/low-stock
router.get('/low-stock', getLowStock);

module.exports = router;
