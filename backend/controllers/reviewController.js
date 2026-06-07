const db = require('../config/db');
const getReviews = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT r.id, r.rating, r.review_text, r.created_at,
              CONCAT(c.first_name, ' ', LEFT(c.last_name, 1), '.') AS customer_name
       FROM reviews r
       JOIN customers c ON c.id = r.customer_id
       ORDER BY r.created_at DESC
       LIMIT 50`
    );

    res.json({ success: true, reviews: rows });

  } catch (err) {
    console.error('Get reviews error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

const submitReview = async (req, res) => {
  const { rating, review_text, order_id } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5.' });
  }
  if (!review_text || review_text.trim() === '') {
    return res.status(400).json({ success: false, message: 'Review text is required.' });
  }

  try {
    await db.query(
      'INSERT INTO reviews (customer_id, order_id, rating, review_text) VALUES (?, ?, ?, ?)',
      [req.customer.id, order_id || null, rating, review_text.trim()]
    );

    res.status(201).json({ success: true, message: 'Review submitted! Thank you 🌟' });

  } catch (err) {
    console.error('Submit review error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = { getReviews, submitReview };
