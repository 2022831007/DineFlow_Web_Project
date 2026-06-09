/* =============================================================
   REVIEW Controller
   Table: reviews (id, customer_id, order_id, rating,
          review_text, status, created_at)
   NOTE: The existing reviews table has no 'status' column.
         We added it via ALTER in adminReviewRoutes.
         The reviews table also requires a customer_id FK.
         For admin purposes we JOIN with customers.
   ============================================================= */
const db = require('../config/db');

// GET /api/admin/reviews — list all with customer name
const getAllReviews = async (req, res) => {
  try {
    const { search = '', rating = 'all' } = req.query;
    let sql = `
      SELECT r.id, r.rating, r.review_text, r.status, r.created_at,
             c.first_name, c.last_name
      FROM reviews r
      JOIN customers c ON r.customer_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      sql += ' AND (c.first_name LIKE ? OR c.last_name LIKE ? OR r.review_text LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (rating !== 'all') {
      sql += ' AND r.rating = ?';
      params.push(parseInt(rating));
    }
    sql += ' ORDER BY r.created_at DESC';

    const [rows] = await db.query(sql, params);
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/admin/reviews/stats
const getReviewStats = async (req, res) => {
  try {
    const [[total]]   = await db.query('SELECT COUNT(*) as count, ROUND(AVG(rating),1) as avg_rating FROM reviews');
    const [[pending]] = await db.query("SELECT COUNT(*) as count FROM reviews WHERE status = 'Pending'");

    res.json({
      success: true,
      data: {
        totalReviews: total.count,
        avgRating:    parseFloat(total.avg_rating) || 0,
        pendingCount: pending.count
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/admin/reviews/:id/approve
const approveReview = async (req, res) => {
  try {
    await db.query("UPDATE reviews SET status = 'Approved' WHERE id = ?", [req.params.id]);
    res.json({ success: true, message: 'Review approved' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/admin/reviews/:id/reject
const rejectReview = async (req, res) => {
  try {
    await db.query("UPDATE reviews SET status = 'Rejected' WHERE id = ?", [req.params.id]);
    res.json({ success: true, message: 'Review rejected' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/admin/reviews/:id
const deleteReview = async (req, res) => {
  try {
    await db.query('DELETE FROM reviews WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getAllReviews, getReviewStats, approveReview, rejectReview, deleteReview };
