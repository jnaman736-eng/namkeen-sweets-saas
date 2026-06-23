# Namkeen & Sweets SaaS Platform

A comprehensive, production-ready SaaS solution for managing multiple namkeen and sweets manufacturing stores/factories across different locations.

## Features

✅ **Multi-Location Management** - Manage unlimited stores and factories
✅ **Inventory Management** - Real-time stock tracking
✅ **Order Management** - Complete order lifecycle tracking
✅ **User Management** - Role-based access control
✅ **Analytics & Reports** - Business intelligence dashboards
✅ **Mobile App** - Full-featured React Native app
✅ **Security** - JWT authentication, encryption, data protection
✅ **Real-time Sync** - WebSocket-based live updates
✅ **API-First Architecture** - RESTful API design
✅ **Docker Support** - Easy deployment

## Tech Stack

### Mobile App
- React Native
- Redux for state management
- Axios for API calls
- React Navigation

### Backend
- Node.js with Express.js
- MongoDB for database
- JWT for authentication
- Socket.io for real-time updates
- Bcrypt for password hashing

### DevOps
- Docker & Docker Compose
- Environment-based configuration

## Quick Start

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
npm start
```

### Mobile App Setup
```bash
cd mobile
npm install
npx expo start
```

### Docker Setup
```bash
docker-compose up
```

## Project Structure
```
namkeen-sweets-saas/
├── backend/              # Node.js API server
├── mobile/               # React Native app
├── docker-compose.yml    # Docker configuration
└── README.md
```

## API Documentation

See `/backend/API.md` for complete API documentation.

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control (RBAC)
- Data encryption for sensitive fields
- Rate limiting
- CORS protection
- Input validation and sanitization

## Database Schema

See `/backend/docs/DATABASE.md` for complete schema documentation.

## License

Private - For internal use only
