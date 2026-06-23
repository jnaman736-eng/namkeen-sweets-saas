# Deployment Guide

## Prerequisites
- Docker and Docker Compose
- Node.js 18+
- MongoDB Atlas account (optional, for cloud database)
- AWS account (optional, for S3 uploads)

## Local Development Setup

### 1. Clone Repository
```bash
git clone https://github.com/jnaman736-eng/namkeen-sweets-saas.git
cd namkeen-sweets-saas
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

### 3. Mobile App Setup
```bash
cd mobile
npm install
npm start
```

## Docker Deployment

### 1. Build and Run
```bash
# Copy environment file
cp .env.example .env

# Start services
docker-compose up -d
```

### 2. Verify Services
```bash
# Check running containers
docker ps

# View backend logs
docker-compose logs backend

# View database logs
docker-compose logs mongodb
```

### 3. Database Initialization
```bash
# Connect to MongoDB
docker-compose exec mongodb mongosh

# Or run initialization script
docker-compose exec backend node scripts/init-db.js
```

## Production Deployment

### Option 1: AWS EC2

1. **Launch EC2 Instance**
   - Ubuntu 22.04 LTS
   - t3.medium or larger
   - Security groups: 80, 443, 5000 (backend)

2. **Install Dependencies**
```bash
sudo apt update
sudo apt install -y docker.io docker-compose curl git
sudo usermod -aG docker $USER
```

3. **Deploy Application**
```bash
git clone <repo-url>
cd namkeen-sweets-saas
cp .env.production .env
docker-compose -f docker-compose.prod.yml up -d
```

### Option 2: Heroku

1. **Prepare for Heroku**
```bash
heroku login
heroku create namkeen-sweets-app
```

2. **Set Environment Variables**
```bash
heroku config:set JWT_SECRET=your-secret
heroku config:set MONGO_URI=your-mongo-uri
```

3. **Deploy**
```bash
git push heroku main
```

### Option 3: Digital Ocean App Platform

1. **Connect Repository**
   - Sign in to Digital Ocean
   - Create new app
   - Connect GitHub repository

2. **Configure Services**
   - Set environment variables
   - Configure MongoDB (via Digital Ocean Databases)
   - Set resource limits

3. **Deploy**
   - Digital Ocean automatically deploys on push

## Environment Variables

```env
# MongoDB
MONGO_USER=admin
MONGO_PASSWORD=secure_password
MONGO_URI=mongodb://admin:password@mongodb:27017/namkeen-sweets?authSource=admin

# Backend
NODE_ENV=production
PORT=5000
BACKEND_URL=https://api.yourdomain.com

# JWT
JWT_SECRET=your-super-secure-secret-min-32-chars
JWT_EXPIRY=7d

# CORS
ALLOWED_ORIGINS=https://yourdomain.com,https://app.yourdomain.com

# Redis
REDIS_URL=redis://redis:6379

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=app-specific-password

# AWS S3 (optional)
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_S3_BUCKET=your-bucket
AWS_REGION=us-east-1
```

## SSL/TLS Setup

### Using Nginx with Let's Encrypt

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Generate certificate
sudo certbot certonly --standalone -d yourdomain.com

# Configure Nginx
sudo nano /etc/nginx/sites-available/namkeen-sweets
```

## Database Backup

```bash
# Backup MongoDB
mongodump --uri "mongodb://user:pass@host:27017/namkeen-sweets" --out ./backup

# Restore MongoDB
mongorestore --uri "mongodb://user:pass@host:27017" ./backup
```

## Monitoring

### Health Check
```bash
curl http://localhost:5000/api/health
```

### Logs
```bash
# Docker logs
docker-compose logs -f backend

# System logs
sudo journalctl -u docker -f
```

## Scaling

### Horizontal Scaling

1. **Load Balancer Setup**
   - Use Nginx, HAProxy, or AWS ALB
   - Route traffic to multiple backend instances

2. **Database Replication**
   - Configure MongoDB replica set
   - Use primary-secondary setup

3. **Caching Layer**
   - Configure Redis cluster
   - Enable session persistence

## Troubleshooting

### MongoDB Connection Issues
```bash
# Check MongoDB status
mongosh --host mongodb --authenticationDatabase admin -u admin -p

# Restart MongoDB
docker-compose restart mongodb
```

### Backend Connection Issues
```bash
# Check logs
docker-compose logs backend

# Restart backend
docker-compose restart backend
```

### Port Already in Use
```bash
# Find process using port
lsof -i :5000

# Kill process
kill -9 <PID>
```
