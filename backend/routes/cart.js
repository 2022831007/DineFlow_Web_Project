const express     = require('express');
const router      = express.Router();
const verifyToken = require('../middleware/auth');
const { getCart, addToCart, updateCart, removeFromCart, clearCart } = require('../controllers/cartController');

router.use(verifyToken); 

router.get('/',                  getCart);
router.post('/',                 addToCart);
router.put('/:food_item_id',     updateCart);
router.delete('/:food_item_id',  removeFromCart);
router.delete('/',               clearCart);

module.exports = router;
