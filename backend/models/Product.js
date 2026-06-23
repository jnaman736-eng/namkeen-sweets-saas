const mongoose = require('mongoose');
const { PRODUCT_CATEGORIES } = require('../config/constants');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: String,
  sku: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  category: {
    type: String,
    enum: Object.values(PRODUCT_CATEGORIES),
    required: true
  },
  subcategory: String,
  price: {
    costPrice: Number,
    sellingPrice: Number,
    wholesalePrice: Number,
    margin: Number
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  specifications: {
    weight: String,
    dimensions: {
      length: Number,
      width: Number,
      height: Number
    },
    ingredients: [String],
    allergens: [String],
    shelfLife: String,
    storageConditions: String
  },
  images: [{
    url: String,
    alt: String,
    isPrimary: Boolean
  }],
  barcode: String,
  minimumStockLevel: Number,
  maximumStockLevel: Number,
  reorderQuantity: Number,
  status: {
    type: String,
    enum: ['active', 'inactive', 'discontinued'],
    default: 'active'
  },
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

productSchema.index({ sku: 1, company: 1 });
productSchema.index({ category: 1 });
productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
