const express = require('express');
const User = require('../models/User');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const { ROLES } = require('../config/constants');
const logger = require('../utils/logger');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Get all users in company
router.get('/', authMiddleware, async (req, res) => {
  try {
    const users = await User.find({ company: req.user.company });
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get user by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.params.id,
      company: req.user.company
    });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create new user
router.post('/', authMiddleware, roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]), [
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('firstName').notEmpty(),
  body('lastName').notEmpty(),
  body('phone').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, firstName, lastName, phone, role, location } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const user = new User({
      email,
      firstName,
      lastName,
      phone,
      role: role || ROLES.STAFF,
      location,
      company: req.user.company,
      password: req.body.password
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: user
    });

    logger.success(`New user created: ${email}`);
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update user
router.put('/:id', authMiddleware, roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]), async (req, res) => {
  try {
    const { firstName, lastName, phone, role, status, location } = req.body;

    const user = await User.findOneAndUpdate(
      { _id: req.params.id, company: req.user.company },
      { firstName, lastName, phone, role, status, location },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, message: 'User updated', data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete user
router.delete('/:id', authMiddleware, roleMiddleware([ROLES.ADMIN]), async (req, res) => {
  try {
    const user = await User.findOneAndDelete({
      _id: req.params.id,
      company: req.user.company
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, message: 'User deleted' });
    logger.info(`User deleted: ${user.email}`);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
