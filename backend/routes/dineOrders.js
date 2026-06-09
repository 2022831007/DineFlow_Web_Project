const express = require('express');
const router = express.Router();
const {
  placeDineOrder,
  getAllDineOrders,
  getDineOrderById
} = require('../controllers/dineOrderController');

router.post('/', placeDineOrder);
router.get('/', getAllDineOrders);
router.get('/:id', getDineOrderById);

module.exports = router;