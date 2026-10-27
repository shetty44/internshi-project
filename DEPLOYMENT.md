# 🚀 Deployment Guide

Complete guide to deploy your Student Performance Dashboard to production.

---

## Option 1: Deploy Backend to Render

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: Student Dashboard MERN"
git branch -M main
git remote add origin https://github.com/yourusername/student-dashboard.git
git push -u origin main
```

### Step 2: Create Render Account

1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Connect your GitHub repository

### Step 3: Configure Backend Service

**Settings:**
- **Name:** student-dashboard-backend
- **Runtime:** Node
- **Build Command:** `cd backend && npm install`
- **Start Command:** `cd backend && npm start`
- **Region:** Choose closest to you

**Environment Variables:**
```
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/student-dashboard
JWT_SECRET=your_production_secret_key_here_change_this
NODE_ENV=production
PORT=5500
```

### Step 4: Deploy

- Click "Create Web Service"
- Wait for build to complete
- Get your backend URL: `https://student-dashboard-backend.onrender.com`

---

## Option 2: Deploy Frontend to Vercel

### Step 1: Prepare Frontend

In `frontend/` folder:

```bash
# Ensure build works
npm run build

# Update API endpoint
# In frontend/src/api.js, change:
# baseURL: process.env.REACT_APP_API_URL || "http://localhost:5500/api"
```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Select your GitHub repository
4. Configure:
   - **Framework Preset:** Create React App
   - **Root Directory:** frontend

### Step 3: Set Environment Variables

In Vercel project settings → Environment Variables:

```
REACT_APP_API_URL=https://student-dashboard-backend.onrender.com/api
```

### Step 4: Deploy

- Click "Deploy"
- Get your frontend URL: `https://student-dashboard.vercel.app`

---

## Option 3: Manual Deployment (VPS)

### Using Ubuntu VPS on DigitalOcean / AWS / Linode

```bash
# SSH into your server
ssh root@your_server_ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install MongoDB (optional for local DB)
sudo apt install -y mongodb

# Clone repository
git clone https://github.com/yourusername/student-dashboard.git
cd student-dashboard

# Setup backend
cd backend
npm install
cp .env.example .env
# Edit .env with production values

# Setup frontend
cd ../frontend
npm install
npm run build

# Install PM2 for process management
npm install -g pm2

# Start backend with PM2
cd backend
pm2 start "npm start" --name "dashboard-backend"

# Setup Nginx reverse proxy
sudo apt install -y nginx

# Create Nginx config
sudo nano /etc/nginx/sites-available/dashboard

# Add this configuration:
upstream backend {
    server 127.0.0.1:5500;
}

server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location /api {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location / {
        root /home/ubuntu/student-dashboard/frontend/build;
        try_files $uri /index.html;
    }
}

# Enable site
sudo ln -s /etc/nginx/sites-available/dashboard /etc/nginx/sites-enabled/

# Test Nginx
sudo nginx -t

# Start Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Setup SSL with Let's Encrypt
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## Option 4: Docker Deployment (Recommended)

### Using Docker & Docker Compose

Prerequisites:
- Docker installed
- Docker Hub account

### Build Images

```bash
# Build backend image
docker build -t yourusername/student-dashboard-backend ./backend

# Build frontend image  
docker build -t yourusername/student-dashboard-frontend ./frontend

# Push to Docker Hub
docker login
docker push yourusername/student-dashboard-backend
docker push yourusername/student-dashboard-frontend
```

### Deploy with Docker Compose

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  mongodb:
    image: mongo:latest
    volumes:
      - mongodb_data:/data/db
    networks:
      - app

  backend:
    image: yourusername/student-dashboard-backend
    environment:
      MONGO_URI: mongodb://mongodb:27017/student-dashboard
      JWT_SECRET: ${JWT_SECRET}
      NODE_ENV: production
    depends_on:
      - mongodb
    networks:
      - app

  frontend:
    image: yourusername/student-dashboard-frontend
    ports:
      - "80:3000"
    environment:
      REACT_APP_API_URL: http://backend:5500/api
    depends_on:
      - backend
    networks:
      - app

volumes:
  mongodb_data:

networks:
  app:
```

Run:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

---

## MongoDB Atlas Setup (Cloud Database)

1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create free account
3. Create M0 free cluster
4. Whitelist your IP or use 0.0.0.0/0
5. Create database user
6. Get connection string
7. Add to `.env`: `MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/student-dashboard`

---

## SSL/HTTPS Setup

### Using Let's Encrypt (Free)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get certificate
sudo certbot certonly --nginx -d yourdomain.com

# Auto-renew
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

---

## Monitoring & Maintenance

### PM2 Management

```bash
# List processes
pm2 list

# Monitor in real-time
pm2 monitor

# View logs
pm2 logs

# Restart after crash
pm2 save
pm2 startup
```

### Database Backups

```bash
# Backup MongoDB
mongodump --uri "mongodb+srv://user:pass@cluster.mongodb.net/student-dashboard" --out ./backup

# Restore  
mongorestore ./backup
```

---

## Performance Optimization

### Frontend (Vercel Auto-Optimizes)
- ✅ Image optimization
- ✅ Code splitting
- ✅ Caching

### Backend (Manual)

```javascript
// Add caching headers in server.js
app.use((req, res, next) => {
  res.set('Cache-Control', 'public, max-age=300');
  next();
});

// Add compression
const compression = require('compression');
app.use(compression());
```

---

## Troubleshooting Deployment

**Frontend can't reach backend:**
- Check CORS settings in backend
- Verify API URL in `.env`
- Check firewall rules

**Database connection failed:**
- IP whitelist in MongoDB Atlas
- Verify connection string
- Check database user permissions

**High memory usage:**
- Implement pagination
- Add database indexing
- Use CDN for static assets

---

## Cost Breakdown (Monthly)

| Service | Price | Notes |
|---------|-------|-------|
| Render Backend | $7 | ~$7/month starter |
| Vercel Frontend | $0 | Free tier generous |
| MongoDB Atlas | $0 | Free tier sufficient |
| Domain | $10 | Namecheap/GoDaddy |
| **Total** | **~$17** | Budget friendly! |

---

## Next Steps

1. ✅ Deploy backend first
2. ✅ Deploy frontend with backend URL
3. ✅ Test authentication flow
4. ✅ Monitor for errors
5. ✅ Set up backups
6. ✅ Configure custom domain

---

**Your project is production-ready! 🚀**
