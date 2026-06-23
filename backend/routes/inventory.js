const express = require('express');
const Inventory = require('../models/Inventory');
const Product = require('../models/Product');
const Location = require('../models/Location');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const { ROLES, INVENTORY_STATUS } = require('../config/constants');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Get inventory by location
router.get('/location/:locationId', authMiddleware, async (req, res) => {
  try {
    const inventory = await Inventory.find({
      location: req.params.locationId
    }).populate('product');

    res.json({ success: true, data: inventory });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get low stock items
router.get('/alerts/low-stock', authMiddleware, async (req, res) => {
  try {
    const inventory = await Inventory.find({
      status: INVENTORY_STATUS.LOW_STOCK
    }).populate('product location');

    res.json({ success: true, data: inventory });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update stock
router.put('/:id/update-stock', authMiddleware, roleMiddleware([ROLES.ADMIN, ROLES.MANAGER, ROLES.STAFF]), [
  body('quantity').isInt(),
  body('action').isIn(['add', 'remove', 'adjust'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { quantity, action, reference, notes } = req.body;
    const inventory = await Inventory.findById(req.params.id);

    if (!inventory) {
      return res.status(404).json({ success: false, message: 'Inventory item not found' });
    }

    let newQuantity = inventory.quantity;
    if (action === 'add') newQuantity += quantity;
    else if (action === 'remove') newQuantity -= quantity;
    else if (action === 'adjust') newQuantity = quantity;

    // Determine status
    const product = await Product.findById(inventory.product);
    let status = INVENTORY_STATUS.IN_STOCK;
    if (newQuantity === 0) status = INVENTORY_STATUS.OUT_OF_STOCK;
    else if (newQuantity < (product?.minimumStockLevel || 10)) status = INVENTORY_STATUS.LOW_STOCK;

    inventory.quantity = newQuantity;
    inventory.status = status;
    inventory.lastStockCheck = new Date();

    inventory.history.push({
      action,
      quantity,
      reference,
      performedBy: req.user._id,
      timestamp: new Date(),
      notes
    });

    await inventory.save();

    // Emit real-time update
    req.app.io?.emit(`inventory-updated-${inventory.location}`, inventory);

    res.json({ success: true, message: 'Stock updated', data: inventory });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Transfer inventory between locations
router.post('/transfer', authMiddleware, roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]), [
  body('fromLocation').notEmpty(),
  body('toLocation').notEmpty(),
  body('product').notEmpty(),
  body('quantity').isInt()
], async (req, res) => {
  try {
    const { fromLocation, toLocation, product, quantity } = req.body;

    const fromInventory = await Inventory.findOne({
      location: fromLocation,
      product
    });

    if (!fromInventory || fromInventory.quantity < quantity) {
      return res.status(400).json({ success: false, message: 'Insufficient stock' });
    }

    fromInventory.quantity -= quantity;
    fromInventory.history.push({
      action: 'transfer',
      quantity: -quantity,
      reference: `Transfer to ${toLocation}`,
      performedBy: req.user._id,
      timestamp: new Date()
    });

    let toInventory = await Inventory.findOne({
      location: toLocation,
      product
    });

    if (!toInventory) {
      toInventory = new Inventory({
        location: toLocation,
        product,
        quantity: 0
      });
    }

    toInventory.quantity += quantity;
    toInventory.history.push({
      action: 'transfer',
      quantity,
      reference: `Transfer from ${fromLocation}`,
      performedBy: req.user._id,
      timestamp: new Date()
    });

    await fromInventory.save();
    await toInventory.save();

    res.json({ success: true, message: 'Inventory transferred' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
