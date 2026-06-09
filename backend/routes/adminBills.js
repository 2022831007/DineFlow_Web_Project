const express = require('express');
const router = express.Router();
const { getAllBills, getBillStats, getBillById, createBill, markBillPaid, deleteBill } = require('../controllers/billController');

// GET /api/admin/bills/stats
router.get('/stats', getBillStats);

// GET /api/admin/bills?search=&status=
router.get('/', getAllBills);

// GET /api/admin/bills/:id
router.get('/:id', getBillById);

// POST /api/admin/bills
router.post('/', createBill);

// PUT /api/admin/bills/:id/pay
router.put('/:id/pay', markBillPaid);

// DELETE /api/admin/bills/:id
router.delete('/:id', deleteBill);

module.exports = router;
