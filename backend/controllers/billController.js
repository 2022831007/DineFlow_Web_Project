/* =============================================================
   BILLING Controller
   Tables: bills (bill_id, order_id, subtotal, vat, discount,
           grand_total, payment_method, payment_status, created_at)
           orders, customers
   ============================================================= */
const db = require('../config/db');

// GET /api/admin/bills
const getAllBills = async (req, res) => {
  try {
    const { search = '', status = 'all' } = req.query;
    let sql = `
      SELECT b.*, o.order_code,
             c.first_name, c.last_name
      FROM bills b
      JOIN orders o ON b.order_id = o.id
      JOIN customers c ON o.customer_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      sql += ' AND (o.order_code LIKE ? OR c.first_name LIKE ? OR c.last_name LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (status !== 'all') {
      sql += ' AND b.payment_status = ?';
      params.push(status);
    }
    sql += ' ORDER BY b.created_at DESC';

    const [rows] = await db.query(sql, params);
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/admin/bills/stats
const getBillStats = async (req, res) => {
  try {
    const [[totalRev]]  = await db.query("SELECT COALESCE(SUM(grand_total),0) as total FROM bills WHERE payment_status='Paid'");
    const [[paid]]      = await db.query("SELECT COUNT(*) as count FROM bills WHERE payment_status='Paid'");
    const [[unpaid]]    = await db.query("SELECT COUNT(*) as count FROM bills WHERE payment_status='Unpaid'");

    res.json({
      success: true,
      data: {
        totalRevenue: parseFloat(totalRev.total),
        paidBills:    paid.count,
        pendingBills: unpaid.count,
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/admin/bills/:id
const getBillById = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT b.*, o.order_code,
             c.first_name, c.last_name
      FROM bills b
      JOIN orders o ON b.order_id = o.id
      JOIN customers c ON o.customer_id = c.id
      WHERE b.bill_id = ?
    `, [req.params.id]);

    if (!rows.length) return res.status(404).json({ success: false, message: 'Bill not found' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/admin/bills  — create a bill linked to an existing order
const createBill = async (req, res) => {
  try {
    const { order_id, subtotal, vat = 0, discount = 0, grand_total, payment_method = 'Cash', payment_status = 'Unpaid' } = req.body;

    if (!order_id || !subtotal || !grand_total) {
      return res.status(400).json({ success: false, message: 'order_id, subtotal, and grand_total are required' });
    }

    const [result] = await db.query(
      'INSERT INTO bills (order_id, subtotal, vat, discount, grand_total, payment_method, payment_status) VALUES (?,?,?,?,?,?,?)',
      [order_id, subtotal, vat, discount, grand_total, payment_method, payment_status]
    );

    res.status(201).json({ success: true, message: 'Bill created', bill_id: result.insertId });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/admin/bills/:id/pay  — mark bill as Paid
const markBillPaid = async (req, res) => {
  try {
    await db.query("UPDATE bills SET payment_status='Paid' WHERE bill_id=?", [req.params.id]);
    res.json({ success: true, message: 'Bill marked as Paid' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/admin/bills/:id
const deleteBill = async (req, res) => {
  try {
    await db.query('DELETE FROM bills WHERE bill_id = ?', [req.params.id]);
    res.json({ success: true, message: 'Bill deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getAllBills, getBillStats, getBillById, createBill, markBillPaid, deleteBill };
