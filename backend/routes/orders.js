const express     = require('express');
const router      = express.Router();
const verifyToken = require('../middleware/auth');
const {
  placeOrder,
  getOrders,
  trackOrder,
  getAllBills,
  createManualBill,
  payBill,
  getRecentOrders
} = require('../controllers/orderController');

router.get('/billing', getAllBills);
router.post('/billing', createManualBill);
router.put('/billing/:id/pay', payBill);
router.get('/recent', getRecentOrders);

router.use(verifyToken); 

router.post('/',               placeOrder);
router.get('/',                getOrders);
router.get('/:order_code',     trackOrder);

module.exports = router;
