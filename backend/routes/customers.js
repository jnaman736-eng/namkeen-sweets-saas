const express = require('express');
const Customer = require('../models/Customer');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const { ROLES } = require('../config/constants');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Get all customers
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { type, search } = req.query;
    let query = { company: req.user.company };

    if (type) query.type = type;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const customers = await Customer.find(query).limit(100);
    res.json({ success: true, data: customers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create customer
router.post('/', authMiddleware, [
  body('name').notEmpty(),
  body('phone').notEmpty(),
  body('type').isIn(['retail', 'wholesale', 'distributor', 'online'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const customer = new Customer({
      ...req.body,
      company: req.user.company
    });

    await customer.save();
    res.status(201).json({ success: true, data: customer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update customer
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const customer = await Customer.findOneAndUpdate(
      { _id: req.params.id, company: req.user.company },
      req.body,
      { new: true }
    );

    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    res.json({ success: true, data: customer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
