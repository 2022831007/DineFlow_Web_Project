const express = require('express');
const router  = express.Router();
const db      = require('../config/db');
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    let query  = 'SELECT * FROM food_items WHERE is_available = 1';
    const params = [];

    if (category && category !== 'all') {
      query += ' AND category = ?';
      params.push(category);
    }
    query += ' ORDER BY id ASC';

    const [rows] = await db.query(query, params);
    res.json({ success: true, items: rows });

  } catch (err) {
    console.error('Menu error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM food_items WHERE id = ? AND is_available = 1',
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Item not found.' });
    }
    res.json({ success: true, item: rows[0] });

  } catch (err) {
    console.error('Menu item error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;
