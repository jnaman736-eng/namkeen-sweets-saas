const express = require('express');
const Order = require('../models/Order');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Generate daily sales report
router.get('/daily-sales', authMiddleware, async (req, res) => {
  try {
    const { date } = req.query;
    const startDate = new Date(date || new Date().toISOString().split('T')[0]);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);

    const report = await Order.aggregate([
      {
        $match: {
          company: req.user.company,
          orderDate: { $gte: startDate, $lt: endDate }
        }
      },
      {
        $group: {
          _id: { $hour: '$orderDate' },
          count: { $sum: 1 },
          revenue: { $sum: '$totalAmount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Generate monthly sales report
router.get('/monthly-sales', authMiddleware, async (req, res) => {
  try {
    const report = await Order.aggregate([
      {
        $match: { company: req.user.company }
      },
      {
        $group: {
          _id: {
            year: { $year: '$orderDate' },
            month: { $month: '$orderDate' }
          },
          count: { $sum: 1 },
          revenue: { $sum: '$totalAmount' }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } }
    ]);

    res.json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
