const db = require('../config/db');

exports.getAllTables = async (req, res) => {
  try {
    const [tables] = await db.query('SELECT * FROM restaurant_tables ORDER BY table_number');
    res.json({ success: true, data: tables });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.addTable = async (req, res) => {
  const { table_number, capacity } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO restaurant_tables (table_number, capacity) VALUES (?, ?)',
      [table_number, capacity || 4]
    );
    res.json({ success: true, message: 'Table added', id: result.insertId });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateTableStatus = async (req, res) => {
  const { status } = req.body;
  try {
    await db.query(
      'UPDATE restaurant_tables SET status=? WHERE id=?',
      [status, req.params.id]
    );
    res.json({ success: true, message: 'Table status updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};