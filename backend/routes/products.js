const express = require('express');
const Product = require('../models/Product');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const { ROLES, PRODUCT_CATEGORIES } = require('../config/constants');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Get all products
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { category, search, status } = req.query;
    let query = { company: req.user.company };

    if (category) query.category = category;
    if (status) query.status = status;
    if (search) {
      query.$text = { $search: search };
    }

    const products = await Product.find(query).limit(100);
    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get product by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      company: req.user.company
    });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create product
router.post('/', authMiddleware, roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]), [
  body('name').notEmpty(),
  body('sku').notEmpty(),
  body('category').isIn(Object.values(PRODUCT_CATEGORIES))
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const product = new Product({
      ...req.body,
      company: req.user.company
    });

    await product.save();
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'SKU already exists' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update product
router.put('/:id', authMiddleware, roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]), async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, company: req.user.company },
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete product
router.delete('/:id', authMiddleware, roleMiddleware([ROLES.ADMIN]), async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      company: req.user.company
    });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
