const express = require('express');
const Location = require('../models/Location');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const { ROLES } = require('../config/constants');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Get all locations
router.get('/', authMiddleware, async (req, res) => {
  try {
    const locations = await Location.find({ company: req.user.company })
      .populate('managers');
    res.json({ success: true, data: locations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get location by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const location = await Location.findOne({
      _id: req.params.id,
      company: req.user.company
    }).populate('managers inventory');

    if (!location) {
      return res.status(404).json({ success: false, message: 'Location not found' });
    }
    res.json({ success: true, data: location });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create location
router.post('/', authMiddleware, roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]), [
  body('name').notEmpty(),
  body('type').isIn(['factory', 'store', 'warehouse', 'distribution']),
  body('phone').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const location = new Location({
      ...req.body,
      company: req.user.company
    });

    await location.save();
    res.status(201).json({ success: true, data: location });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update location
router.put('/:id', authMiddleware, roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]), async (req, res) => {
  try {
    const location = await Location.findOneAndUpdate(
      { _id: req.params.id, company: req.user.company },
      req.body,
      { new: true, runValidators: true }
    );

    if (!location) {
      return res.status(404).json({ success: false, message: 'Location not found' });
    }

    res.json({ success: true, data: location });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete location
router.delete('/:id', authMiddleware, roleMiddleware([ROLES.ADMIN]), async (req, res) => {
  try {
    const location = await Location.findOneAndDelete({
      _id: req.params.id,
      company: req.user.company
    });

    if (!location) {
      return res.status(404).json({ success: false, message: 'Location not found' });
    }

    res.json({ success: true, message: 'Location deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
