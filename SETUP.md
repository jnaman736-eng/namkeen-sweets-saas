# Setup Instructions

## Quick Start (5 minutes)

### Prerequisites
- Node.js 18 or higher
- npm or yarn
- Docker and Docker Compose (optional)

### Option 1: Local Development

1. **Clone Repository**
   ```bash
   git clone https://github.com/jnaman736-eng/namkeen-sweets-saas.git
   cd namkeen-sweets-saas
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Mobile Dependencies**
   ```bash
   cd ../mobile
   npm install
   ```

4. **Configure Environment**
   ```bash
   cd ../backend
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Start Backend**
   ```bash
   npm run dev
   # Server will run on http://localhost:5000
   ```

6. **Start Mobile App** (in new terminal)
   ```bash
   cd mobile
   npm start
   # Scan QR code with Expo Go app
   ```

### Option 2: Docker Deployment

1. **Clone Repository**
   ```bash
   git clone https://github.com/jnaman736-eng/namkeen-sweets-saas.git
   cd namkeen-sweets-saas
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env if needed
   ```

3. **Start Services**
   ```bash
   docker-compose up -d
   ```

4. **Verify Services**
   ```bash
   # Check containers
   docker ps
   
   # Check backend logs
   docker-compose logs backend
   ```

5. **Access Application**
   - Backend API: http://localhost:5000/api
   - Health Check: http://localhost:5000/api/health
   - MongoDB: mongodb://localhost:27017
   - Redis: redis://localhost:6379

## Configuration

### Environment Variables

Edit `.env` file:

```env
# Database
MONGO_USER=admin
MONGO_PASSWORD=admin123
MONGO_URI=mongodb://admin:admin123@localhost:27017/namkeen-sweets?authSource=admin

# Server
NODE_ENV=development
PORT=5000

# JWT
JWT_SECRET=your-secret-key-min-32-characters
JWT_EXPIRY=7d

# CORS
ALLOWED_ORIGINS=http://localhost:8081,http://localhost:19000

# Redis
REDIS_URL=redis://localhost:6379
```

## Testing

### Register New User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123",
    "firstName": "Admin",
    "lastName": "User",
    "phone": "9876543210",
    "companyName": "My Company"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

### Get Orders
```bash
curl -X GET http://localhost:5000/api/orders \
  -H "Authorization: Bearer <YOUR_TOKEN>"
```

## Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
Solution:
- Ensure MongoDB is running
- Check MONGO_URI in .env
- For Docker: `docker-compose restart mongodb`

### Port Already in Use
```
Error: listen EADDRINUSE :::5000
```
Solution:
- Change PORT in .env
- Or kill process: `lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill -9`

### Module Not Found
```
Error: Cannot find module 'express'
```
Solution:
- Run `npm install` in backend directory
- Delete node_modules and package-lock.json, then reinstall

### Expo App Issues
```
Error: Failed to connect to server
```
Solution:
- Ensure backend is running
- Update EXPO_PUBLIC_API_URL in .env
- Restart Expo: `npm start -- --clear`

## File Structure

```
namkeen-sweets-saas/
├── backend/                 # Node.js API server
│   ├── models/              # MongoDB schemas
│   ├── routes/              # API endpoints
│   ├── middleware/          # Custom middleware
│   ├── config/              # Configuration files
│   ├── utils/               # Utility functions
│   ├── server.js            # Entry point
│   └── package.json
│
├── mobile/                  # React Native app
│   ├── screens/             # Screen components
│   ├── components/          # Reusable components
│   ├── navigation/          # Navigation setup
│   ├── store/               # Redux store
│   ├── api/                 # API integration
│   ├── utils/               # Utilities
│   ├── styles/              # Theme and styles
│   ├── App.js               # Entry point
│   └── package.json
│
├── docker-compose.yml       # Docker services
├── .env.example             # Environment template
├── README.md                # Main documentation
├── SETUP.md                 # This file
├── DEPLOYMENT.md            # Deployment guide
├── CONTRIBUTING.md          # Contributing guidelines
└── SECURITY.md              # Security policy
```

## Next Steps

1. **Create First Location**
   - Use admin panel or API
   - Set location type (factory, store, warehouse)
   - Add managers and staff

2. **Add Products**
   - Upload product information
   - Set pricing tiers
   - Configure stock levels

3. **Setup Inventory**
   - Initialize stock for each location
   - Set up reorder alerts
   - Configure transfer routes

4. **Create Customers**
   - Add retail, wholesale, distributor customers
   - Set credit limits
   - Configure delivery addresses

5. **Start Taking Orders**
   - Create orders through app/dashboard
   - Track order status
   - Monitor inventory in real-time

## Support

For issues and questions:
- GitHub Issues: https://github.com/jnaman736-eng/namkeen-sweets-saas/issues
- Email: support@namkeensweets.com
- Documentation: See README.md and API.md

## License

Private - For internal use only
