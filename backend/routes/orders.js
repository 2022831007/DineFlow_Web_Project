const express     = require('express');
const router      = express.Router();
const verifyToken = require('../middleware/auth');
const { placeOrder, getOrders, trackOrder } = require('../controllers/orderController');

router.use(verifyToken); 

router.post('/',               placeOrder);
router.get('/',                getOrders);
router.get('/:order_code',     trackOrder);

module.exports = router;
