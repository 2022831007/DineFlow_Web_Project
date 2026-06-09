const express = require('express');
const router = express.Router();
const { getAllReviews, getReviewStats, approveReview, rejectReview, deleteReview } = require('../controllers/adminReviewController');

// GET /api/admin/reviews/stats
router.get('/stats', getReviewStats);

// GET /api/admin/reviews?search=&rating=
router.get('/', getAllReviews);

// PUT /api/admin/reviews/:id/approve
router.put('/:id/approve', approveReview);

// PUT /api/admin/reviews/:id/reject
router.put('/:id/reject', rejectReview);

// DELETE /api/admin/reviews/:id
router.delete('/:id', deleteReview);

module.exports = router;
