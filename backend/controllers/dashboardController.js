/* =============================================================
   ADMIN Dashboard Controller
   Uses: food_items, orders, reviews, inventory tables
   ============================================================= */
const db = require('../config/db');

// GET /api/admin/dashboard/stats
const getStats = async (req, res) => {
  try {
    const [[foods]]      = await db.query('SELECT COUNT(*) as count FROM food_items');
    const [[invItems]]   = await db.query('SELECT COUNT(*) as count FROM inventory');
    const [[orders]]     = await db.query('SELECT COUNT(*) as count FROM orders');
    const [[revenue]]    = await db.query("SELECT COALESCE(SUM(grand_total), 0) as total FROM bills WHERE payment_status = 'Paid'");
    const [[reviews]]    = await db.query('SELECT COUNT(*) as count FROM reviews');
    const [[lowStock]]   = await db.query('SELECT COUNT(*) as count FROM inventory WHERE quantity <= minimum_stock');

    res.json({
      success: true,
      data: {
        totalFoods:     foods.count,
        totalInventory: invItems.count,
        totalOrders:    orders.count,
        totalRevenue:   parseFloat(revenue.total),
        totalReviews:   reviews.count,
        lowStockCount:  lowStock.count,
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/admin/dashboard/recent-orders
const getRecentOrders = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT o.id, o.order_code, o.status, o.grand_total, o.created_at,
             c.first_name, c.last_name
      FROM orders o
      JOIN customers c ON o.customer_id = c.id
      ORDER BY o.created_at DESC LIMIT 10
    `);
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/admin/dashboard/recent-reviews
const getRecentReviews = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT r.id, r.rating, r.review_text, r.created_at,
             c.first_name, c.last_name
      FROM reviews r
      JOIN customers c ON r.customer_id = c.id
      ORDER BY r.created_at DESC LIMIT 5
    `);
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/admin/dashboard/low-stock
const getLowStock = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM inventory WHERE quantity <= minimum_stock ORDER BY quantity ASC'
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getStats, getRecentOrders, getRecentReviews, getLowStock };
