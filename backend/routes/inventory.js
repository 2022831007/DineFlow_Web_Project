const express = require('express');
const router = express.Router();
const {
  getAllInventory,
  addInventory,
  updateInventory,
  deleteInventory
} = require('../controllers/inventoryController');

router.get('/', getAllInventory);
router.post('/', addInventory);
router.put('/:id', updateInventory);
router.delete('/:id', deleteInventory);

module.exports = router;
