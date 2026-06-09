const express = require('express');
const router = express.Router();
const {
  getKitchenOrders,
  updateOrderStatus,
  getSalesReport
} = require('../controllers/kitchenController');

router.get('/orders', getKitchenOrders);
router.put('/orders/:id/status', updateOrderStatus);
router.get('/sales-report', getSalesReport);

module.exports = router;