const express = require('express');
const router = express.Router();
const { getAllInventory, getLowStock, createInventoryItem, updateInventoryItem, deleteInventoryItem } = require('../controllers/inventoryController');

// GET /api/admin/inventory?search=&filter=
router.get('/', getAllInventory);

// GET /api/admin/inventory/low-stock
router.get('/low-stock', getLowStock);

// POST /api/admin/inventory
router.post('/', createInventoryItem);

// PUT /api/admin/inventory/:id
router.put('/:id', updateInventoryItem);

// DELETE /api/admin/inventory/:id
router.delete('/:id', deleteInventoryItem);

module.exports = router;
