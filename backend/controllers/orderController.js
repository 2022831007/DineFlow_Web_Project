const db = require('../config/db');

const placeOrder = async (req, res) => {
  const { address_id, full_address, area } = req.body;
  const customerId = req.customer.id;

  try {
    
    const [cartItems] = await db.query(
      `SELECT c.quantity, c.food_item_id,
              f.name, f.price, f.emoji
       FROM cart c
       JOIN food_items f ON f.id = c.food_item_id
       WHERE c.customer_id = ?`,
      [customerId]
    );

    if (cartItems.length === 0) {
      return res.status(400).json({ success: false, message: 'Your cart is empty!' });
    }

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const vat      = Math.round(subtotal * 0.05 * 100) / 100;
    const grand    = Math.round((subtotal + vat) * 100) / 100;

    let addrId = address_id;
    if (!addrId && full_address) {
      const [addrResult] = await db.query(
        'INSERT INTO addresses (customer_id, area, full_address, is_default) VALUES (?, ?, ?, 0)',
        [customerId, area || '', full_address]
      );
      addrId = addrResult.insertId;
    }

    const orderCode = 'DF-' + Math.floor(1000 + Math.random() * 9000);

    const [orderResult] = await db.query(
      `INSERT INTO orders
       (order_code, customer_id, address_id, order_type, payment_method, subtotal, vat, grand_total, status)
       VALUES (?, ?, ?, 'online', 'cod', ?, ?, ?, 'confirmed')`,
      [orderCode, customerId, addrId || null, subtotal, vat, grand]
    );
    const orderId = orderResult.insertId;

    for (const item of cartItems) {
      await db.query(
        `INSERT INTO order_items (order_id, food_item_id, name, price, quantity, subtotal)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [orderId, item.food_item_id, item.name, item.price, item.quantity, item.price * item.quantity]
      );
    }

    await db.query('DELETE FROM cart WHERE customer_id = ?', [customerId]);

    res.status(201).json({
      success: true,
      message: `Order placed! Order #${orderCode}`,
      order: {
        id: orderId,
        order_code: orderCode,
        status: 'confirmed',
        subtotal,
        vat,
        grand_total: grand
      }
    });

  } catch (err) {
    console.error('Place order error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};
const getOrders = async (req, res) => {
  try {
    const [orders] = await db.query(
      `SELECT o.id, o.order_code, o.status, o.grand_total,
              o.payment_method, o.created_at,
              a.area, a.full_address
       FROM orders o
       LEFT JOIN addresses a ON a.id = o.address_id
       WHERE o.customer_id = ? AND o.order_type = 'online'
       ORDER BY o.created_at DESC`,
      [req.customer.id]
    );

    res.json({ success: true, orders });

  } catch (err) {
    console.error('Get orders error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

const trackOrder = async (req, res) => {
  try {
    const [orders] = await db.query(
      `SELECT o.id, o.order_code, o.status, o.subtotal, o.vat,
              o.grand_total, o.payment_method, o.created_at,
              a.area, a.full_address
       FROM orders o
       LEFT JOIN addresses a ON a.id = o.address_id
       WHERE o.order_code = ? AND o.customer_id = ?`,
      [req.params.order_code, req.customer.id]
    );

    if (orders.length === 0) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    const order = orders[0];

    const [items] = await db.query(
      `SELECT oi.name, oi.price, oi.quantity, oi.subtotal, f.emoji
       FROM order_items oi
       LEFT JOIN food_items f ON f.id = oi.food_item_id
       WHERE oi.order_id = ?`,
      [order.id]
    );

    res.json({ success: true, order: { ...order, items } });

  } catch (err) {
    console.error('Track order error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

const getAllBills = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        o.id,
        o.order_code AS orderNo,
        o.order_type,
        o.payment_method,
        o.status AS order_status,
        o.created_at,
        COALESCE(o.total_amount, o.grand_total, 0) AS amount,
        rt.table_number,
        u.name AS waiter_name,
        CONCAT(c.first_name, ' ', COALESCE(c.last_name, '')) AS customer_name
      FROM orders o
      LEFT JOIN restaurant_tables rt ON o.table_id = rt.id
      LEFT JOIN users u ON o.user_id = u.id
      LEFT JOIN customers c ON o.customer_id = c.id
      ORDER BY o.created_at DESC
    `);

    const bills = rows.map(r => {
      let customer = 'Customer';
      if (r.order_type === 'dine_in') {
        customer = `Table ${r.table_number || '?'}`;
        if (r.waiter_name) {
          customer += ` (Waiter: ${r.waiter_name})`;
        }
      } else if (r.customer_name && r.customer_name.trim() !== '') {
        customer = r.customer_name;
      }

      let status = 'Pending';
      if (r.order_status === 'served' || r.order_status === 'delivered') {
        status = 'Paid';
      }

      let method = r.payment_method || 'Cash';
      if (method === 'cod') method = 'Cash';
      else if (method === 'cash') method = 'Cash';

      return {
        id: `B-${r.id}`,
        orderNo: r.orderNo || `ORD-${r.id}`,
        customer,
        amount: parseFloat(r.amount),
        method,
        status,
        date: new Date(r.created_at).toISOString().split('T')[0]
      };
    });

    res.json({ success: true, bills });
  } catch (err) {
    console.error('Get all bills error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

const createManualBill = async (req, res) => {
  const { orderNo, customer, amount, method, status } = req.body;
  const amountNum = parseFloat(amount) || 0;
  const orderStatus = status === 'Paid' ? 'served' : 'pending';
  const payMethod = (method || 'Cash').toLowerCase() === 'cash' ? 'cash' : 'cod';

  try {
    const [result] = await db.query(
      `INSERT INTO orders (order_code, order_type, payment_method, total_amount, grand_total, status)
       VALUES (?, 'dine_in', ?, ?, ?, ?)`,
      [orderNo || `ORD-${Math.floor(1000 + Math.random() * 9000)}`, payMethod, amountNum, amountNum, orderStatus]
    );
    res.status(201).json({ success: true, message: 'Manual bill created', id: `B-${result.insertId}` });
  } catch (err) {
    console.error('Create manual bill error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

const payBill = async (req, res) => {
  const orderId = req.params.id.startsWith('B-') ? req.params.id.split('-')[1] : req.params.id;
  try {
    const [orders] = await db.query('SELECT order_type, table_id FROM orders WHERE id = ?', [orderId]);
    if (orders.length === 0) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    const order = orders[0];
    const newStatus = order.order_type === 'dine_in' ? 'served' : 'delivered';

    await db.query('UPDATE orders SET status = ? WHERE id = ?', [newStatus, orderId]);

    if (order.order_type === 'dine_in' && order.table_id) {
      await db.query('UPDATE restaurant_tables SET status = "available" WHERE id = ?', [order.table_id]);
    }

    res.json({ success: true, message: 'Bill marked as Paid' });
  } catch (err) {
    console.error('Pay bill error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

const getRecentOrders = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        o.id,
        o.order_code,
        o.order_type,
        o.status,
        COALESCE(o.total_amount, o.grand_total, 0) AS total,
        o.created_at,
        rt.table_number,
        CONCAT(c.first_name, ' ', COALESCE(c.last_name, '')) AS customer_name
      FROM orders o
      LEFT JOIN restaurant_tables rt ON o.table_id = rt.id
      LEFT JOIN customers c ON o.customer_id = c.id
      ORDER BY o.created_at DESC
      LIMIT 10
    `);

    const orders = rows.map(r => {
      let customer = 'Customer';
      if (r.order_type === 'dine_in') {
        customer = `Table ${r.table_number || '?'}`;
      } else if (r.customer_name && r.customer_name.trim() !== '') {
        customer = r.customer_name;
      }

      let status = 'Pending';
      if (r.status === 'served' || r.status === 'delivered') status = 'Delivered';
      else if (r.status === 'pending') status = 'Pending';
      else if (r.status === 'preparing') status = 'Preparing';
      else if (r.status === 'ready') status = 'Preparing';

      return {
        id: r.order_code || `ORD-${r.id}`,
        customer,
        total: parseFloat(r.total),
        status,
        time: new Date(r.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
    });

    res.json({ success: true, orders });
  } catch (err) {
    console.error('Get recent orders error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = { placeOrder, getOrders, trackOrder, getAllBills, createManualBill, payBill, getRecentOrders };
