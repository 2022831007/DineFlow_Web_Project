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

module.exports = { placeOrder, getOrders, trackOrder };
