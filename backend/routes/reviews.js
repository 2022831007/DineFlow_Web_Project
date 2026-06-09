const express     = require('express');
const router      = express.Router();
const verifyToken = require('../middleware/auth');
const {
  getReviews,
  submitReview,
  getAllReviews,
  updateReviewStatus,
  deleteReview
} = require('../controllers/reviewController');

router.get('/',       getReviews);                    
router.post('/',      verifyToken, submitReview);     
router.get('/all',    getAllReviews);
router.put('/:id/status', updateReviewStatus);
router.delete('/:id', deleteReview);

module.exports = router;
