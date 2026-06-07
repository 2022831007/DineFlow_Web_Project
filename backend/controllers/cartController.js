const db = require('../config/db');
const getCart = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT c.id, c.quantity, c.food_item_id,
              f.name, f.price, f.emoji, f.img_url, f.category,
              (f.price * c.quantity) AS subtotal
       FROM cart c
       JOIN food_items f ON f.id = c.food_item_id
       WHERE c.customer_id = ?
       ORDER BY c.created_at ASC`,
      [req.customer.id]
    );

    const total = rows.reduce((sum, item) => sum + parseFloat(item.subtotal), 0);

    res.json({ success: true, cart: rows, total: total.toFixed(2) });

  } catch (err) {
    console.error('Get cart error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

const addToCart = async (req, res) => {
  const { food_item_id, quantity } = req.body;

  if (!food_item_id) {
    return res.status(400).json({ success: false, message: 'food_item_id is required.' });
  }

  const qty = quantity || 1;

  try {
    
    const [food] = await db.query(
      'SELECT id, name FROM food_items WHERE id = ? AND is_available = 1',
      [food_item_id]
    );
    if (food.length === 0) {
      return res.status(404).json({ success: false, message: 'Food item not found.' });
    }

    await db.query(
      `INSERT INTO cart (customer_id, food_item_id, quantity)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE quantity = quantity + ?`,
      [req.customer.id, food_item_id, qty, qty]
    );

    res.json({ success: true, message: `${food[0].name} added to cart!` });

  } catch (err) {
    console.error('Add to cart error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};
const updateCart = async (req, res) => {
  const { quantity } = req.body;
  const { food_item_id } = req.params;

  if (!quantity || quantity < 1) {
    return res.status(400).json({ success: false, message: 'Quantity must be at least 1.' });
  }

  try {
    const [result] = await db.query(
      'UPDATE cart SET quantity = ? WHERE customer_id = ? AND food_item_id = ?',
      [quantity, req.customer.id, food_item_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Cart item not found.' });
    }

    res.json({ success: true, message: 'Cart updated.' });

  } catch (err) {
    console.error('Update cart error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

const removeFromCart = async (req, res) => {
  try {
    await db.query(
      'DELETE FROM cart WHERE customer_id = ? AND food_item_id = ?',
      [req.customer.id, req.params.food_item_id]
    );

    res.json({ success: true, message: 'Item removed from cart.' });

  } catch (err) {
    console.error('Remove from cart error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

const clearCart = async (req, res) => {
  try {
    await db.query(
      'DELETE FROM cart WHERE customer_id = ?',
      [req.customer.id]
    );

    res.json({ success: true, message: 'Cart cleared.' });

  } catch (err) {
    console.error('Clear cart error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = { getCart, addToCart, updateCart, removeFromCart, clearCart };
