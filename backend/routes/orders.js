const express = require('express');
const Order = require('../models/Order');
const Customer = require('../models/Customer');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const { ROLES, ORDER_STATUS } = require('../config/constants');
const { body, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// Generate unique order number
const generateOrderNumber = () => {
  return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
};

// Get all orders
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;
    let query = { company: req.user.company };

    if (status) query.status = status;
    if (startDate || endDate) {
      query.orderDate = {};
      if (startDate) query.orderDate.$gte = new Date(startDate);
      if (endDate) query.orderDate.$lte = new Date(endDate);
    }

    const orders = await Order.find(query)
      .populate('customer fromLocation toLocation items.product createdBy')
      .sort({ orderDate: -1 })
      .limit(100);

    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get order by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      company: req.user.company
    }).populate('customer fromLocation toLocation items.product statusHistory.changedBy');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create order
router.post('/', authMiddleware, [
  body('customer').notEmpty(),
  body('fromLocation').notEmpty(),
  body('items').isArray().notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { customer, fromLocation, toLocation, items, notes } = req.body;

    // Calculate totals
    let subtotal = 0;
    let tax = 0;
    let discount = 0;

    items.forEach(item => {
      subtotal += (item.unitPrice * item.quantity);
      if (item.discount) discount += item.discount;
      if (item.tax) tax += item.tax;
    });

    const order = new Order({
      orderNumber: generateOrderNumber(),
      customer,
      company: req.user.company,
      fromLocation,
      toLocation,
      items,
      subtotal,
      tax,
      discount,
      totalAmount: subtotal + tax - discount,
      notes,
      createdBy: req.user._id,
      statusHistory: [{
        status: ORDER_STATUS.PENDING,
        timestamp: new Date(),
        changedBy: req.user._id
      }]
    });

    await order.save();

    // Update customer total
    await Customer.findByIdAndUpdate(customer, {
      $inc: { totalOrders: 1, totalPurchase: order.totalAmount }
    });

    // Emit real-time update
    req.app.io?.emit('order-created', order);

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update order status
router.put('/:id/status', authMiddleware, roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]), [
  body('status').isIn(Object.values(ORDER_STATUS))
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { status, notes } = req.body;

    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, company: req.user.company },
      {
        status,
        updatedBy: req.user._id,
        $push: {
          statusHistory: {
            status,
            timestamp: new Date(),
            changedBy: req.user._id,
            notes
          }
        }
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Emit real-time update
    req.app.io?.emit(`order-updated-${order._id}`, order);

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
