const express = require('express');
const Order = require('../models/Order');
const Inventory = require('../models/Inventory');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Get sales analytics
router.get('/sales', authMiddleware, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let query = { company: req.user.company };

    if (startDate || endDate) {
      query.orderDate = {};
      if (startDate) query.orderDate.$gte = new Date(startDate);
      if (endDate) query.orderDate.$lte = new Date(endDate);
    }

    const orders = await Order.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
          totalOrders: { $sum: 1 },
          averageOrderValue: { $avg: '$totalAmount' }
        }
      }
    ]);

    res.json({ success: true, data: orders[0] || {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get inventory analytics
router.get('/inventory', authMiddleware, async (req, res) => {
  try {
    const analytics = await Inventory.aggregate([
      {
        $group: {
          _id: null,
          totalItems: { $sum: 1 },
          totalQuantity: { $sum: '$quantity' },
          lowStockItems: {
            $sum: { $cond: [{ $eq: ['$status', 'low_stock'] }, 1, 0] }
          },
          outOfStock: {
            $sum: { $cond: [{ $eq: ['$status', 'out_of_stock'] }, 1, 0] }
          }
        }
      }
    ]);

    res.json({ success: true, data: analytics[0] || {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
