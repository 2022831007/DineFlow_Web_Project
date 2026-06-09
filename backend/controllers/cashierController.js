/* =============================================================
   CASHIER Controller
   Tables: orders, bills, payments, food_items, customers
   ============================================================= */
const db = require('../config/db');

// GET /api/cashier/stats — today's summary
const getCashierStats = async (req, res) => {
  try {
    const [[todayOrders]]    = await db.query("SELECT COUNT(*) as count FROM orders WHERE DATE(created_at)=CURDATE()");
    const [[pending]]        = await db.query("SELECT COUNT(*) as count FROM orders WHERE status IN ('pending','preparing','ready')");
    const [[completed]]      = await db.query("SELECT COUNT(*) as count FROM orders WHERE status='delivered' AND DATE(created_at)=CURDATE()");
    const [[revenue]]        = await db.query("SELECT COALESCE(SUM(grand_total),0) as total FROM bills WHERE payment_status='Paid' AND DATE(created_at)=CURDATE()");
    const [[bills]]          = await db.query("SELECT COUNT(*) as count FROM bills WHERE DATE(created_at)=CURDATE()");
    const [[cashPay]]        = await db.query("SELECT COALESCE(SUM(grand_total),0) as total FROM bills WHERE payment_method='Cash' AND payment_status='Paid' AND DATE(created_at)=CURDATE()");
    const [[cardPay]]        = await db.query("SELECT COALESCE(SUM(grand_total),0) as total FROM bills WHERE payment_method='Card' AND payment_status='Paid' AND DATE(created_at)=CURDATE()");
    const [[mobilePay]]      = await db.query("SELECT COALESCE(SUM(grand_total),0) as total FROM bills WHERE payment_method='Mobile Banking' AND payment_status='Paid' AND DATE(created_at)=CURDATE()");

    res.json({
      success: true,
      data: {
        todayOrders:    todayOrders.count,
        pendingOrders:  pending.count,
        completedOrders: completed.count,
        revenue:        parseFloat(revenue.total),
        billsGenerated: bills.count,
        payments: {
          cash:   parseFloat(cashPay.total),
          card:   parseFloat(cardPay.total),
          mobile: parseFloat(mobilePay.total),
        }
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/cashier/orders — live order queue (not delivered/cancelled)
const getCashierOrders = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT o.id, o.order_code, o.status, o.grand_total, o.created_at,
             c.first_name, c.last_name,
             COUNT(oi.id) as itemsCount,
             COALESCE(b.payment_status, 'Unpaid') as paymentStatus
      FROM orders o
      JOIN customers c ON o.customer_id = c.id
      LEFT JOIN order_items oi ON oi.order_id = o.id
      LEFT JOIN bills b ON b.order_id = o.id
      WHERE o.status NOT IN ('delivered','cancelled')
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `);
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/cashier/recent-orders — last 20 orders (all statuses)
const getRecentOrders = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT o.id, o.order_code, o.status, o.grand_total, o.created_at,
             c.first_name, c.last_name,
             COALESCE(b.payment_status, 'Unpaid') as paymentStatus
      FROM orders o
      JOIN customers c ON o.customer_id = c.id
      LEFT JOIN bills b ON b.order_id = o.id
      ORDER BY o.created_at DESC
      LIMIT 20
    `);
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/cashier/orders/:id/status — update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['pending','confirmed','preparing','ready','delivered','cancelled'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }
    await db.query('UPDATE orders SET status=? WHERE id=?', [status, req.params.id]);
    res.json({ success: true, message: `Order status updated to ${status}` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/cashier/generate-bill — create bill + payment record
const generateBill = async (req, res) => {
  try {
    const { order_id, subtotal, vat = 0, discount = 0, grand_total, payment_method = 'Cash' } = req.body;
    if (!order_id || !subtotal || !grand_total) {
      return res.status(400).json({ success: false, message: 'order_id, subtotal, grand_total required' });
    }

    // Insert bill
    const [billResult] = await db.query(
      "INSERT INTO bills (order_id, subtotal, vat, discount, grand_total, payment_method, payment_status) VALUES (?,?,?,?,?,?,'Paid')",
      [order_id, subtotal, vat, discount, grand_total, payment_method]
    );
    const billId = billResult.insertId;

    // Insert payment record
    await db.query(
      "INSERT INTO payments (bill_id, amount, payment_method, payment_status) VALUES (?,?,?,'Success')",
      [billId, grand_total, payment_method]
    );

    // Mark order as delivered
    await db.query("UPDATE orders SET status='delivered' WHERE id=?", [order_id]);

    res.status(201).json({ success: true, message: 'Bill generated & payment recorded', bill_id: billId });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getCashierStats, getCashierOrders, getRecentOrders, updateOrderStatus, generateBill };
