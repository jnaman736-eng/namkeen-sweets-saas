# Database Schema Documentation

## Collections

### Users
Stores user information and authentication data.

```javascript
{
  firstName: String,
  lastName: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  role: String (admin, manager, staff, customer),
  location: ObjectId (ref: Location),
  company: ObjectId (ref: Company),
  status: String (active, inactive, suspended),
  avatar: String,
  lastLogin: Date,
  twoFactorEnabled: Boolean,
  permissions: [String],
  createdAt: Date,
  updatedAt: Date
}
```

### Companies
Multi-tenant company information.

```javascript
{
  name: String,
  description: String,
  registrationNumber: String,
  taxId: String,
  owner: ObjectId (ref: User),
  subscription: {
    plan: String (free, starter, professional, enterprise),
    status: String,
    startDate: Date,
    endDate: Date,
    features: [String]
  },
  settings: {
    currency: String,
    timezone: String,
    dateFormat: String,
    language: String
  },
  locations: [ObjectId],
  users: [ObjectId],
  createdAt: Date,
  updatedAt: Date
}
```

### Locations
Stores factory, store, warehouse, and distribution center information.

```javascript
{
  name: String,
  type: String (factory, store, warehouse, distribution),
  company: ObjectId (ref: Company),
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
  operatingHours: Object,
  status: String (active, inactive, maintenance),
  managers: [ObjectId],
  inventory: [ObjectId],
  createdAt: Date,
  updatedAt: Date
}
```

### Products
Product information including pricing and specifications.

```javascript
{
  name: String,
  description: String,
  sku: String (unique),
  category: String (namkeen, sweets, packaged, fresh),
  company: ObjectId (ref: Company),
  price: {
    costPrice: Number,
    sellingPrice: Number,
    wholesalePrice: Number,
    margin: Number
  },
  specifications: {
    weight: String,
    dimensions: Object,
    ingredients: [String],
    allergens: [String],
    shelfLife: String,
    storageConditions: String
  },
  images: [Object],
  barcode: String,
  minimumStockLevel: Number,
  maximumStockLevel: Number,
  status: String (active, inactive, discontinued),
  createdAt: Date,
  updatedAt: Date
}
```

### Inventory
Real-time inventory tracking at each location.

```javascript
{
  product: ObjectId (ref: Product),
  location: ObjectId (ref: Location),
  quantity: Number,
  status: String (in_stock, low_stock, out_of_stock),
  lastStockCheck: Date,
  expiryDate: Date,
  batchNumber: String,
  storageLocation: {
    shelf: String,
    rack: String,
    bin: String
  },
  history: [{
    action: String,
    quantity: Number,
    reference: String,
    performedBy: ObjectId,
    timestamp: Date,
    notes: String
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### Orders
Complete order information with tracking.

```javascript
{
  orderNumber: String (unique),
  customer: ObjectId (ref: Customer),
  company: ObjectId (ref: Company),
  fromLocation: ObjectId (ref: Location),
  toLocation: ObjectId (ref: Location),
  items: [{
    product: ObjectId,
    quantity: Number,
    unitPrice: Number,
    discount: Number,
    tax: Number,
    total: Number
  }],
  status: String (pending, confirmed, processing, ready, shipped, delivered, cancelled),
  orderDate: Date,
  expectedDeliveryDate: Date,
  deliveryDate: Date,
  paymentStatus: String,
  paymentMethod: String,
  subtotal: Number,
  tax: Number,
  discount: Number,
  shippingCost: Number,
  totalAmount: Number,
  notes: String,
  statusHistory: [{
    status: String,
    timestamp: Date,
    changedBy: ObjectId,
    notes: String
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### Customers
Customer information for orders and relationships.

```javascript
{
  name: String,
  email: String,
  phone: String,
  type: String (retail, wholesale, distributor, online),
  company: ObjectId (ref: Company),
  address: Object,
  gst: String,
  pan: String,
  creditLimit: Number,
  creditUsed: Number,
  status: String (active, inactive, suspended),
  totalPurchase: Number,
  totalOrders: Number,
  loyaltyPoints: Number,
  tags: [String],
  createdAt: Date,
  updatedAt: Date
}
```

## Indexes

- User: `email (unique)`, `company`, `role`
- Product: `sku (unique)`, `category`, `company`
- Inventory: `product + location (unique)`, `status`
- Order: `orderNumber (unique)`, `customer`, `status`, `orderDate`
- Customer: `phone + company (unique)`, `email`
