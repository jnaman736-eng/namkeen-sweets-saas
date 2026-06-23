const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['factory', 'store', 'warehouse', 'distribution'],
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
    country: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  contactPerson: String,
  email: String,
  phone: String,
  capacity: {
    maxInventory: Number,
    currentUtilization: Number
  },
  operatingHours: {
    monday: { open: String, close: String },
    tuesday: { open: String, close: String },
    wednesday: { open: String, close: String },
    thursday: { open: String, close: String },
    friday: { open: String, close: String },
    saturday: { open: String, close: String },
    sunday: { open: String, close: String }
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'maintenance'],
    default: 'active'
  },
  managers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  inventory: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InventoryItem'
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

module.exports = mongoose.model('Location', locationSchema);
