const mongoose = require('mongoose');
const { ORDER_STATUS } = require('../config/constants');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  fromLocation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',
    required: true
  },
  toLocation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location'
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    unitPrice: Number,
    discount: Number,
    tax: Number,
    total: Number
  }],
  status: {
    type: String,
    enum: Object.values(ORDER_STATUS),
    default: ORDER_STATUS.PENDING
  },
  orderDate: {
    type: Date,
    default: Date.now
  },
  expectedDeliveryDate: Date,
  deliveryDate: Date,
  paymentStatus: {
    type: String,
    enum: ['pending', 'partial', 'paid', 'overdue'],
    default: 'pending'
  },
  paymentMethod: String,
  subtotal: Number,
  tax: Number,
  discount: Number,
  shippingCost: Number,
  totalAmount: Number,
  notes: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  statusHistory: [{
    status: String,
    timestamp: Date,
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
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

orderSchema.index({ orderNumber: 1 });
orderSchema.index({ customer: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ orderDate: -1 });

module.exports = mongoose.model('Order', orderSchema);
