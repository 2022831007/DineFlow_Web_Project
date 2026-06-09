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
      ORDER BY date DESC
    `, [from, to]);

    res.json({ success: true, data: report });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};