const express     = require('express');
const router      = express.Router();
const verifyToken = require('../middleware/auth');
const { getReviews, submitReview } = require('../controllers/reviewController');

router.get('/',   getReviews);                    
router.post('/',  verifyToken, submitReview);     

module.exports = router;
