const express = require('express');
const router  = express.Router();
const db      = require('../config/db');
router.get('/', async (req, res) => {
  try {
    const { category, all } = req.query;
    let query  = 'SELECT * FROM food_items';
    const params = [];
    const conditions = [];

    if (all !== 'true') {
      conditions.push('is_available = 1');
    }

    if (category && category !== 'all') {
      conditions.push('category = ?');
      params.push(category);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
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

router.post('/', async (req, res) => {
  const { name, description, price, category, emoji, badge, badge_class, is_available } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO food_items (name, description, price, category, emoji, badge, badge_class, is_available) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, description || '', price, category, emoji || '🍽️', badge || '', badge_class || '', is_available !== undefined ? is_available : 1]
    );
    res.status(201).json({ success: true, message: 'Menu item added', id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const { name, description, price, category, emoji, badge, badge_class, is_available } = req.body;
  try {
    await db.query(
      'UPDATE food_items SET name=?, description=?, price=?, category=?, emoji=?, badge=?, badge_class=?, is_available=? WHERE id=?',
      [name, description, price, category, emoji, badge, badge_class, is_available !== undefined ? is_available : 1, req.params.id]
    );
    res.json({ success: true, message: 'Menu item updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM food_items WHERE id=?', [req.params.id]);
    res.json({ success: true, message: 'Menu item deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
