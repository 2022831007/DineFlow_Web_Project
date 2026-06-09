/* =============================================================
   SALES REPORT Controller
   Aggregates data from orders & bills tables for charts
   ============================================================= */
const db = require('../config/db');

// GET /api/admin/reports/daily  — last 7 days revenue per day
const getDaily = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT DATE(b.created_at) as date,
             COUNT(b.bill_id)   as totalBills,
             SUM(b.grand_total) as revenue
      FROM bills b
      WHERE b.payment_status = 'Paid'
        AND b.created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
      GROUP BY DATE(b.created_at)
      ORDER BY date ASC
    `);
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/admin/reports/weekly  — last 4 weeks
const getWeekly = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT YEARWEEK(b.created_at, 1) as week,
             MIN(DATE(b.created_at))   as weekStart,
             COUNT(b.bill_id)          as totalBills,
             SUM(b.grand_total)        as revenue
      FROM bills b
      WHERE b.payment_status = 'Paid'
        AND b.created_at >= DATE_SUB(CURDATE(), INTERVAL 28 DAY)
      GROUP BY YEARWEEK(b.created_at, 1)
      ORDER BY week ASC
    `);
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/admin/reports/monthly  — last 12 months
const getMonthly = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT DATE_FORMAT(b.created_at, '%Y-%m') as month,
             COUNT(b.bill_id)                   as totalBills,
             SUM(b.grand_total)                 as revenue
      FROM bills b
      WHERE b.payment_status = 'Paid'
        AND b.created_at >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
      GROUP BY DATE_FORMAT(b.created_at, '%Y-%m')
      ORDER BY month ASC
    `);
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/admin/reports/yearly
const getYearly = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT YEAR(b.created_at) as year,
             COUNT(b.bill_id)   as totalBills,
             SUM(b.grand_total) as revenue
      FROM bills b
      WHERE b.payment_status = 'Paid'
      GROUP BY YEAR(b.created_at)
      ORDER BY year ASC
    `);
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/admin/reports/top-foods  — top 5 food items by order count
const getTopFoods = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT f.name, f.category, f.emoji,
             COUNT(oi.id)     as unitsSold,
             SUM(oi.subtotal) as revenue
      FROM order_items oi
      JOIN food_items f ON oi.food_item_id = f.id
      GROUP BY oi.food_item_id
      ORDER BY unitsSold DESC
      LIMIT 5
    `);
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/admin/reports/summary  — combined stats for the Sales dashboard cards
const getSummary = async (req, res) => {
  try {
    const [[daily]]   = await db.query("SELECT COALESCE(SUM(grand_total),0) as total FROM bills WHERE payment_status='Paid' AND DATE(created_at)=CURDATE()");
    const [[weekly]]  = await db.query("SELECT COALESCE(SUM(grand_total),0) as total FROM bills WHERE payment_status='Paid' AND created_at >= DATE_SUB(CURDATE(),INTERVAL 7 DAY)");
    const [[monthly]] = await db.query("SELECT COALESCE(SUM(grand_total),0) as total FROM bills WHERE payment_status='Paid' AND MONTH(created_at)=MONTH(CURDATE()) AND YEAR(created_at)=YEAR(CURDATE())");
    const [[allTime]] = await db.query("SELECT COALESCE(SUM(grand_total),0) as total FROM bills WHERE payment_status='Paid'");

    res.json({
      success: true,
      data: {
        dailyRevenue:   parseFloat(daily.total),
        weeklyRevenue:  parseFloat(weekly.total),
        monthlyRevenue: parseFloat(monthly.total),
        totalRevenue:   parseFloat(allTime.total),
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getDaily, getWeekly, getMonthly, getYearly, getTopFoods, getSummary };
