const express = require('express');
const jwt = require('jwt-simple');
const User = require('../models/User');
const Company = require('../models/Company');
const { authMiddleware } = require('../middleware/auth');
const logger = require('../utils/logger');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Register
router.post('/register', [
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

    const { email, password, firstName, lastName, phone, companyName } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Create company
    const company = new Company({
      name: companyName || `${firstName}'s Company`,
      owner: null // Will be set after user creation
    });

    // Create user
    user = new User({
      firstName,
      lastName,
      email,
      password,
      phone,
      company: company._id,
      role: 'admin'
    });

    company.owner = user._id;
    company.users.push(user._id);

    await company.save();
    await user.save();

    const token = jwt.encode({ id: user._id, email: user.email }, process.env.JWT_SECRET);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        role: user.role
      }
    });

    logger.success(`New user registered: ${email}`);
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Login
router.post('/login', [
  body('email').isEmail(),
  body('password').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password').populate('company');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (user.status === 'inactive') {
      return res.status(401).json({ success: false, message: 'Account is inactive' });
    }

    user.lastLogin = new Date();
    user.loginAttempts = 0;
    await user.save();

    const token = jwt.encode({ id: user._id, email: user.email }, process.env.JWT_SECRET);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        role: user.role,
        company: user.company
      }
    });

    logger.success(`User logged in: ${email}`);
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Verify Token
router.get('/verify', authMiddleware, (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

// Refresh Token
router.post('/refresh', authMiddleware, (req, res) => {
  try {
    const token = jwt.encode({ id: req.user._id, email: req.user.email }, process.env.JWT_SECRET);
    res.json({ success: true, token });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
