const db = require('../config/db');

exports.placeDineOrder = async (req, res) => {
  const { table_id, waiter_id, items } = req.body;
  
  if (!table_id || !waiter_id || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, message: 'Missing required fields or items' });
  }

  try {
    // Calculate total
    const total = items.reduce((sum, i) => sum + (i.price * i.quantity), 0);

    // Create dine-in order
    const [order] = await db.query(
      'INSERT INTO orders (table_id, user_id, order_type, total_amount, status) VALUES (?, ?, "dine_in", ?, "pending")',
      [table_id, waiter_id, total]
    );

    const orderId = order.insertId;

    // Insert order items
    for (const item of items) {
      await db.query(
        'INSERT INTO order_items (order_id, menu_item_id, quantity, price, special_note) VALUES (?, ?, ?, ?, ?)',
        [orderId, item.menu_item_id, item.quantity, item.price, item.special_note || null]
      );
    }

    // Update table status to occupied
    await db.query('UPDATE restaurant_tables SET status = "occupied" WHERE id = ?', [table_id]);

    res.json({ 
      success: true, 
      message: 'Dine-in order placed successfully', 
      order_id: orderId 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllDineOrders = async (req, res) => {
  try {
    const [orders] = await db.query(`
      SELECT o.*, rt.table_number, u.name as waiter_name
      FROM orders o
      JOIN restaurant_tables rt ON o.table_id = rt.id
      LEFT JOIN users u ON o.user_id = u.id
      WHERE o.order_type = 'dine_in' 
        AND o.status NOT IN ('served', 'cancelled')
      ORDER BY o.created_at DESC
    `);
    
    res.json({ success: true, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getDineOrderById = async (req, res) => {
  try {
    const [order] = await db.query(`
      SELECT o.*, rt.table_number 
      FROM orders o
      JOIN restaurant_tables rt ON o.table_id = rt.id
      WHERE o.id = ? AND o.order_type = 'dine_in'
    `, [req.params.id]);

    if (order.length === 0) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const [items] = await db.query(`
      SELECT oi.*, m.name as item_name 
      FROM order_items oi
      JOIN menu m ON oi.menu_item_id = m.id
      WHERE oi.order_id = ?
    `, [req.params.id]);

    res.json({ 
      success: true, 
      data: { 
        ...order[0], 
        items 
      } 
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};