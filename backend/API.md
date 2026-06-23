# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Auth Endpoints

### Register
```
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "9876543210",
  "companyName": "My Company"
}

Response: 201 Created
{
  "success": true,
  "token": "eyJhbGc...",
  "user": {
    "id": "...",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "admin"
  }
}
```

### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response: 200 OK
{
  "success": true,
  "token": "eyJhbGc...",
  "user": {...}
}
```

## Orders Endpoints

### Get All Orders
```
GET /orders?status=pending&startDate=2024-01-01&endDate=2024-01-31

Response: 200 OK
{
  "success": true,
  "data": [...]
}
```

### Create Order
```
POST /orders

{
  "customer": "customerId",
  "fromLocation": "locationId",
  "toLocation": "locationId",
  "items": [
    {
      "product": "productId",
      "quantity": 10,
      "unitPrice": 100
    }
  ],
  "notes": "Special order"
}

Response: 201 Created
```

### Update Order Status
```
PUT /orders/:id/status

{
  "status": "confirmed",
  "notes": "Order confirmed"
}

Response: 200 OK
```

## Inventory Endpoints

### Get Location Inventory
```
GET /inventory/location/:locationId

Response: 200 OK
{
  "success": true,
  "data": [...]
}
```

### Update Stock
```
PUT /inventory/:id/update-stock

{
  "quantity": 50,
  "action": "add",
  "reference": "PO-12345",
  "notes": "New stock received"
}

Response: 200 OK
```

### Transfer Inventory
```
POST /inventory/transfer

{
  "fromLocation": "locationId1",
  "toLocation": "locationId2",
  "product": "productId",
  "quantity": 10
}

Response: 200 OK
```

## Products Endpoints

### Get All Products
```
GET /products?category=namkeen&search=chips&status=active

Response: 200 OK
```

### Create Product
```
POST /products

{
  "name": "Masala Chips",
  "sku": "SKU-001",
  "category": "namkeen",
  "price": {
    "costPrice": 50,
    "sellingPrice": 100,
    "wholesalePrice": 80
  },
  "specifications": {
    "weight": "200g",
    "ingredients": ["rice", "salt", "spices"],
    "shelfLife": "6 months"
  },
  "minimumStockLevel": 10,
  "maximumStockLevel": 100
}

Response: 201 Created
```

## Analytics Endpoints

### Get Sales Analytics
```
GET /analytics/sales?startDate=2024-01-01&endDate=2024-01-31

Response: 200 OK
{
  "success": true,
  "data": {
    "totalRevenue": 50000,
    "totalOrders": 100,
    "averageOrderValue": 500
  }
}
```

## WebSocket Events

### Connect
```javascript
const socket = io('http://localhost:5000');
socket.emit('join-location', locationId);
```

### Listen to Events
```javascript
socket.on('order-created', (order) => {
  console.log('New order:', order);
});

socket.on('order-updated-{orderId}', (order) => {
  console.log('Order updated:', order);
});

socket.on('inventory-updated-{locationId}', (inventory) => {
  console.log('Inventory updated:', inventory);
});
```

## Error Handling

All errors follow this format:
```json
{
  "success": false,
  "message": "Error message",
  "errors": []
}
```

Common status codes:
- 200: Success
- 201: Created
- 400: Bad request
- 401: Unauthorized
- 403: Forbidden
- 404: Not found
- 500: Server error
