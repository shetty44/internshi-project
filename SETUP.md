# Installation & Setup Guide

## Quick Start (5 minutes)

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env

# Edit .env with your MongoDB URI
# Then start:
npm run dev
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm start
```

### 3. Open Browser

Visit: **http://localhost:3000**

---

## Environment Variables

**Backend (.env):**

```env
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/student-dashboard
JWT_SECRET=your_super_secret_key_change_in_production
PORT=5500
NODE_ENV=development
```

---

## First Steps

1. ✅ Click "Sign Up" to create an account
2. ✅ Login with your credentials
3. ✅ Click "+ Add Score" to record an assessment
4. ✅ View your dashboard with charts and analytics

---

## Useful Commands

**Backend Development:**
```bash
cd backend
npm run dev      # Start with auto-reload
npm start        # Start server
```

**Frontend Development:**
```bash
cd frontend
npm start        # Start React dev server
npm build        # Build for production
```

---

## MongoDB Setup (Free)

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create a cluster (M0 free tier)
4. Get connection string
5. Paste in `.env`

**Example Connection String:**
```
mongodb+srv://myusername:mypassword@cluster0.mongodb.net/student-dashboard?retryWrites=true&w=majority
```

---

## Need Help?

- Check backend is running: `http://localhost:5000/api/health`
- Check frontend is running: `http://localhost:3000`
- Look at terminal output for errors
- Verify .env file has correct MongoDB URI

---

**You're all set! Start building! 🚀**
