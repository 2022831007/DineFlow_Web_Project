const express = require('express');
const router = express.Router();
const {
  getAllTables,
  addTable,
  updateTableStatus
} = require('../controllers/tableController');

router.get('/', getAllTables);
router.post('/', addTable);
router.put('/:id/status', updateTableStatus);

module.exports = router;