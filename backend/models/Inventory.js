const mongoose = require('mongoose');
const { INVENTORY_STATUS } = require('../config/constants');

const inventorySchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 0
  },
  status: {
    type: String,
    enum: Object.values(INVENTORY_STATUS),
    default: INVENTORY_STATUS.IN_STOCK
  },
  lastStockCheck: Date,
  expiryDate: Date,
  batchNumber: String,
  storageLocation: {
    shelf: String,
    rack: String,
    bin: String
  },
  reorderAlert: Boolean,
  history: [{
    action: String,
    quantity: Number,
    reference: String,
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    timestamp: Date,
    notes: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

inventorySchema.index({ product: 1, location: 1 });
inventorySchema.index({ status: 1 });

module.exports = mongoose.model('Inventory', inventorySchema);
