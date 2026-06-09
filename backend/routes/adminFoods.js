const express = require('express');
const router = express.Router();
const { getAllFoods, getFoodById, createFood, updateFood, deleteFood } = require('../controllers/foodController');

// GET /api/admin/foods?search=&category=
router.get('/', getAllFoods);

// GET /api/admin/foods/:id
router.get('/:id', getFoodById);

// POST /api/admin/foods
router.post('/', createFood);

// PUT /api/admin/foods/:id
router.put('/:id', updateFood);

// DELETE /api/admin/foods/:id
router.delete('/:id', deleteFood);

module.exports = router;
