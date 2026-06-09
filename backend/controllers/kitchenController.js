const db = require('../config/db');

exports.getKitchenOrders = async (req, res) => {
  try {
    const [orders] = await db.query(`
      SELECT 
        o.id,
        o.status,
        o.created_at,
        o.total_amount,
        rt.table_number,
        u.name as waiter_name,
        GROUP_CONCAT(CONCAT(oi.quantity, 'x ', m.name) SEPARATOR ', ') AS items_summary
      FROM orders o
      JOIN restaurant_tables rt ON o.table_id = rt.id
      LEFT JOIN users u ON o.user_id = u.id
      JOIN order_items oi ON oi.order_id = o.id
      JOIN menu m ON oi.menu_item_id = m.id
      WHERE o.order_type = 'dine_in' 
        AND o.status IN ('pending', 'preparing')
      GROUP BY o.id, o.status, o.created_at, o.total_amount, rt.table_number, u.name
      ORDER BY o.created_at ASC
    `);

    res.json({ success: true, data: orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['pending', 'preparing', 'ready', 'served', 'cancelled'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status' });
  }

  try {
    await db.query(
      'UPDATE orders SET status = ? WHERE id = ? AND order_type = "dine_in"',
      [status, req.params.id]
    );

    // If order is served, make table available again
    if (status === 'served') {
      const [order] = await db.query(
        'SELECT table_id FROM orders WHERE id = ?',
        [req.params.id]
      );

      if (order.length > 0) {
        await db.query(
          'UPDATE restaurant_tables SET status = "available" WHERE id = ?',
          [order[0].table_id]
        );
      }
    }

    res.json({
      success: true,
      message: `Order status updated to ${status}`
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getSalesReport = async (req, res) => {
  const { from, to } = req.query;

  try {
    // 1. Daily trend report
    const [report] = await db.query(`
      SELECT 
        DATE(created_at) as date, 
        COUNT(*) as total_orders, 
        SUM(total_amount) as revenue
      FROM orders 
      WHERE order_type = 'dine_in' 
        AND status = 'served'
        AND DATE(created_at) BETWEEN ? AND ?
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `, [from, to]);

    // 2. Category breakdown
    const [categories] = await db.query(`
      SELECT 
        f.category, 
        SUM(oi.quantity) as qty, 
        SUM(oi.price * oi.quantity) as revenue
      FROM order_items oi
      JOIN food_items f ON oi.food_item_id = f.id
      JOIN orders o ON oi.order_id = o.id
      WHERE o.status = 'served'
        AND DATE(o.created_at) BETWEEN ? AND ?
      GROUP BY f.category
      ORDER BY revenue DESC
    `, [from, to]);

    // 3. Top selling foods
    const [topFoods] = await db.query(`
      SELECT 
        f.id,
        f.name,
        f.category as cat,
        f.emoji,
        SUM(oi.quantity) as units_sold,
        SUM(oi.price * oi.quantity) as revenue
      FROM order_items oi
      JOIN food_items f ON oi.food_item_id = f.id
      JOIN orders o ON oi.order_id = o.id
      WHERE o.status = 'served'
        AND DATE(o.created_at) BETWEEN ? AND ?
      GROUP BY f.id, f.name, f.category, f.emoji
      ORDER BY units_sold DESC
      LIMIT 5
    `, [from, to]);

    res.json({
      success: true,
      data: report,
      categories,
      topFoods
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};