const db = require('../config/db');

exports.getAllInventory = async (req, res) => {
  try {
    const [inventory] = await db.query('SELECT * FROM inventory ORDER BY id');
    res.json({ success: true, data: inventory });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.addInventory = async (req, res) => {
  const { id, name, cat, qty, unit } = req.body;
  const qtyNum = parseInt(qty, 10) || 0;
  const status = qtyNum < 10 ? 'Low Stock' : 'In Stock';
  const today = new Date().toISOString().split('T')[0];

  try {
    let finalId = id;
    if (!finalId) {
      const [rows] = await db.query('SELECT COUNT(*) as count FROM inventory');
      const nextNum = rows[0].count + 1;
      finalId = `INV-${String(nextNum).padStart(3, '0')}`;
    }

    await db.query(
      'INSERT INTO inventory (id, name, cat, qty, unit, status, updated) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [finalId, name, cat, qtyNum, unit || 'pcs', status, today]
    );
    res.status(201).json({ success: true, message: 'Inventory item added', id: finalId });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateInventory = async (req, res) => {
  const { name, cat, qty, unit } = req.body;
  const qtyNum = parseInt(qty, 10);
  const status = qtyNum < 10 ? 'Low Stock' : 'In Stock';
  const today = new Date().toISOString().split('T')[0];

  try {
    await db.query(
      'UPDATE inventory SET name=?, cat=?, qty=?, unit=?, status=?, updated=? WHERE id=?',
      [name, cat, qtyNum, unit, status, today, req.params.id]
    );
    res.json({ success: true, message: 'Inventory item updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteInventory = async (req, res) => {
  try {
    await db.query('DELETE FROM inventory WHERE id=?', [req.params.id]);
    res.json({ success: true, message: 'Inventory item deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
