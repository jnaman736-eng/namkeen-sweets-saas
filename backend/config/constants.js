// User Roles
const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  STAFF: 'staff',
  CUSTOMER: 'customer'
};

// Order Status
const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  READY: 'ready',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

// Inventory Status
const INVENTORY_STATUS = {
  IN_STOCK: 'in_stock',
  LOW_STOCK: 'low_stock',
  OUT_OF_STOCK: 'out_of_stock'
};

// Product Categories
const PRODUCT_CATEGORIES = {
  NAMKEEN: 'namkeen',
  SWEETS: 'sweets',
  PACKAGED: 'packaged',
  FRESH: 'fresh'
};

module.exports = {
  ROLES,
  ORDER_STATUS,
  INVENTORY_STATUS,
  PRODUCT_CATEGORIES
};
