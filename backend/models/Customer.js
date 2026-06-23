const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['retail', 'wholesale', 'distributor', 'online'],
    required: true
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String
  },
  gst: String,
  pan: String,
  creditLimit: {
    type: Number,
    default: 0
  },
  creditUsed: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  totalPurchase: { type: Number, default: 0 },
  totalOrders: { type: Number, default: 0 },
  loyaltyPoints: { type: Number, default: 0 },
  tags: [String],
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

customerSchema.index({ phone: 1, company: 1 });
customerSchema.index({ email: 1 });

module.exports = mongoose.model('Customer', customerSchema);
