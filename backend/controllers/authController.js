const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const db     = require('../config/db');
require('dotenv').config();

const register = async (req, res) => {
  const { first_name, last_name, email, phone, password, area, full_address } = req.body;

  if (!first_name || !email || !phone || !password || !full_address) {
    return res.status(400).json({
      success: false,
      message: 'Please fill in all required fields.'
    });
  }

  try {
    
    const [existing] = await db.query(
      'SELECT id FROM customers WHERE email = ?',
      [email]
    );
    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered.'
      });
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

    
    const [result] = await db.query(
      'INSERT INTO customers (first_name, last_name, email, phone, password) VALUES (?, ?, ?, ?, ?)',
      [first_name, last_name || '', email, phone, hashedPassword]
    );
    const customerId = result.insertId;

    
    await db.query(
      'INSERT INTO addresses (customer_id, area, full_address, is_default) VALUES (?, ?, ?, 1)',
      [customerId, area || '', full_address]
    );

    
    const name = `${first_name} ${last_name || ''}`.trim();
    const token = jwt.sign(
      { id: customerId, email, name },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(201).json({
      success: true,
      message: `Welcome to DineFlow, ${first_name}!`,
      token,
      customer: { id: customerId, name, email, phone }
    });

  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};


const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password required.'
    });
  }

  try {
    const [rows] = await db.query(
      'SELECT * FROM customers WHERE email = ?',
      [email]
    );
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email.'
      });
    }

    const customer = rows[0];

    
    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect password.'
      });
    }

    
    const name = `${customer.first_name} ${customer.last_name}`.trim();
    const token = jwt.sign(
      { id: customer.id, email: customer.email, name },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      success: true,
      message: `Welcome back, ${customer.first_name}!`,
      token,
      customer: { id: customer.id, name, email: customer.email, phone: customer.phone }
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};


const getMe = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT c.id, c.first_name, c.last_name, c.email, c.phone,
              a.area, a.full_address
       FROM customers c
       LEFT JOIN addresses a ON a.customer_id = c.id AND a.is_default = 1
       WHERE c.id = ?`,
      [req.customer.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Customer not found.' });
    }

    res.json({ success: true, customer: rows[0] });

  } catch (err) {
    console.error('GetMe error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = { register, login, getMe };
