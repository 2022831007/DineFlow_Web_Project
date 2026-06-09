const express = require('express');
const router = express.Router();
const { getDaily, getWeekly, getMonthly, getYearly, getTopFoods, getSummary } = require('../controllers/reportController');

// GET /api/admin/reports/summary
router.get('/summary', getSummary);

// GET /api/admin/reports/daily
router.get('/daily', getDaily);

// GET /api/admin/reports/weekly
router.get('/weekly', getWeekly);

// GET /api/admin/reports/monthly
router.get('/monthly', getMonthly);

// GET /api/admin/reports/yearly
router.get('/yearly', getYearly);

// GET /api/admin/reports/top-foods
router.get('/top-foods', getTopFoods);

module.exports = router;
