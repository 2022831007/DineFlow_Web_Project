/* =============================================================
   FOOD MANAGEMENT Controller
   Table: food_items (id, name, description, price, category,
          emoji, badge, badge_class, rating, review_count,
          img_url, is_available, created_at)
   ============================================================= */
const db = require('../config/db');

// GET /api/admin/foods  — list with optional search & filter
const getAllFoods = async (req, res) => {
  try {
    const { search = '', category = 'all' } = req.query;
    let sql = 'SELECT * FROM food_items WHERE 1=1';
    const params = [];

    if (search) {
      sql += ' AND (name LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    if (category !== 'all') {
      sql += ' AND category = ?';
      params.push(category);
    }
    sql += ' ORDER BY id DESC';

    const [rows] = await db.query(sql, params);
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/admin/foods/:id
const getFoodById = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM food_items WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'Food not found' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/admin/foods
const createFood = async (req, res) => {
  try {
    const { name, description = '', price, category, emoji = '🍽️', badge = '', badge_class = '', img_url = '', is_available = 1 } = req.body;
    if (!name || !price || !category) return res.status(400).json({ success: false, message: 'name, price and category are required' });

    const [result] = await db.query(
      'INSERT INTO food_items (name, description, price, category, emoji, badge, badge_class, img_url, is_available) VALUES (?,?,?,?,?,?,?,?,?)',
      [name, description, price, category, emoji, badge, badge_class, img_url, is_available]
    );
    res.status(201).json({ success: true, message: 'Food item created', id: result.insertId });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/admin/foods/:id
const updateFood = async (req, res) => {
  try {
    const { name, description, price, category, emoji, badge, badge_class, img_url, is_available } = req.body;
    await db.query(
      'UPDATE food_items SET name=?, description=?, price=?, category=?, emoji=?, badge=?, badge_class=?, img_url=?, is_available=? WHERE id=?',
      [name, description, price, category, emoji, badge, badge_class, img_url, is_available, req.params.id]
    );
    res.json({ success: true, message: 'Food item updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/admin/foods/:id
const deleteFood = async (req, res) => {
  try {
    await db.query('DELETE FROM food_items WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Food item deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getAllFoods, getFoodById, createFood, updateFood, deleteFood };
