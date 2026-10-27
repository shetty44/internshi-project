# 🎓 Student Performance Dashboard - MERN

A complete, production-ready **full-stack MERN application** for tracking student performance with authentication, analytics, and interactive charts.

---

## 🌟 Features

✅ **User Authentication**
- JWT-based secure login/signup
- Password hashing with bcryptjs
- Protected routes

✅ **Performance Tracking**
- Record assessment scores across multiple subjects
- Automatic performance categorization (Excellent/Good/Average)
- Track time spent on each assessment

✅ **Analytics Dashboard**
- Interactive score trend charts (Line & Bar)
- Best score, average score, and total assessments
- Performance breakdown by category
- Real-time statistics

✅ **Filtering & Organization**
- Filter scores by subject
- Sort by date (most recent first)
- Responsive grid layout

✅ **Professional UI**
- Beautiful gradient design
- Mobile-responsive
- Smooth animations and transitions
- Error handling and loading states

---

## 🛠️ Tech Stack

**Frontend:**
- React 18
- React Router DOM (navigation)
- Axios (HTTP client)
- Chart.js + React-ChartJS-2 (graphs)
- CSS3 (responsive design)

**Backend:**
- Node.js + Express.js
- MongoDB + Mongoose
- JWT (authentication)
- bcryptjs (password hashing)
- CORS (cross-origin support)

**Tools:**
- Git & GitHub
- NPM (package manager)

---

## 📁 Project Structure

```
student-dashboard/
│
├── backend/
│   ├── models/
│   │   ├── User.js              # User schema
│   │   └── Score.js             # Assessment score schema
│   ├── routes/
│   │   ├── authRoutes.js        # Login/signup endpoints
│   │   └── scoreRoutes.js       # Score CRUD endpoints
│   ├── middleware/
│   │   └── authMiddleware.js    # JWT verification
│   ├── config/
│   │   └── db.js                # MongoDB connection
│   ├── server.js                # Express server
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
│
├── frontend/
│   ├── src/
│   │   ├── components/          # Reusable components
│   │   ├── pages/
│   │   │   ├── Login.js         # Login page
│   │   │   ├── Signup.js        # Registration page
│   │   │   └── Dashboard.js     # Main dashboard
│   │   ├── api.js               # Axios configuration
│   │   ├── App.js               # Main app component
│   │   └── index.js             # Entry point
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   ├── .gitignore
│   └── README.md
│
├── .gitignore
└── README.md                    # This file
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas cloud)
- Git

### Installation

#### 1️⃣ Clone the repository

```bash
git clone https://github.com/yourusername/student-dashboard.git
cd student-dashboard
```

#### 2️⃣ Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file (copy from .env.example)
cp .env.example .env

# Add your MongoDB URI and JWT secret to .env
# Example:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/student-dashboard
# JWT_SECRET=your_super_secret_key_here
# PORT=5500

# Start the server
npm run dev
```

**Backend runs on:** `http://localhost:5500`

#### 3️⃣ Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

**Frontend runs on:** `http://localhost:3000`

---

## 📋 API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |

**Register Example:**
```json
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secure123"
}
```

**Login Example:**
```json
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "secure123"
}
```

### Scores

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/scores` | Get all scores (Auth required) |
| POST | `/api/scores` | Add new score (Auth required) |
| GET | `/api/scores/analytics/summary` | Get analytics (Auth required) |
| GET | `/api/scores/filter/subject/:subject` | Filter by subject (Auth required) |
| DELETE | `/api/scores/:scoreId` | Delete a score (Auth required) |

**Add Score Example:**
```json
POST /api/scores
Authorization: Bearer <token>

{
  "subject": "Math",
  "score": 85,
  "timeSpent": 60
}
```

---

## 🔐 Authentication Flow

1. **Register** → User creates account with email/password
2. **Login** → User receives JWT token
3. **Token Storage** → Token saved in `localStorage`
4. **Protected Routes** → All score endpoints require valid token
5. **Auto-logout** → Token expires after 7 days

---

## 📊 Database Schema

### User Collection

```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String ("student" | "admin"),
  createdAt: Date,
  updatedAt: Date
}
```

### Score Collection

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  subject: String ("Math" | "Science" | "English" | "History" | "Programming"),
  score: Number (0-100),
  timeSpent: Number (minutes),
  category: String ("Excellent" | "Good" | "Average"),
  date: Date,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🎯 Performance Categories

- 🟢 **Excellent**: Score ≥ 80
- 🟡 **Good**: Score ≥ 60 and < 80
- 🔴 **Average**: Score < 60

---

## 🧪 Test Login Credentials

After setup, try logging in with:

```
Email: test@example.com
Password: test123456
```

(Create this account via signup page first, or add to MongoDB directly)

---

## 📈 How to Explain in Interview

> *"I built a full-stack Student Performance Dashboard using the MERN stack. The application allows students to register, log in securely using JWT authentication, and track their assessment scores across different subjects. The dashboard features interactive charts showing score trends and performance analytics. Each score is automatically categorized as Excellent, Good, or Average based on predefined thresholds. The backend is built with Express.js and MongoDB, providing RESTful APIs for authentication and score management. The frontend uses React with responsive design, making it mobile-friendly. I implemented proper error handling, loading states, and a professional UI with gradient designs."*

---

## 🌐 Deployment

### Deploy Backend (Render)

1. Push code to GitHub
2. Connect repository to Render.com
3. Add environment variables in Render dashboard
4. Deploy

### Deploy Frontend (Vercel)

1. Push code to GitHub
2. Connect repository to Vercel
3. Set API endpoint to deployed backend
4. Deploy

---

## 🐛 Troubleshooting

**"MongoDB connection failed"**
- Verify `MONGO_URI` in `.env`
- Check MongoDB network access settings
- Ensure IP whitelist includes your machine

**"CORS error"**
- Backend CORS is enabled for all origins (development)
- For production, update CORS settings in `server.js`

**"Token expired"**
- Tokens expire after 7 days
- User must login again

---

## 📚 Learning Resources

- [MongoDB Atlas Setup](https://www.mongodb.com/cloud/atlas)
- [JWT Authentication](https://jwt.io/)
- [React Documentation](https://react.dev/)
- [Express.js Guide](https://expressjs.com/)
- [Chart.js Documentation](https://www.chartjs.org/)

---

## ✨ Future Enhancements

- 🔄 Admin panel for user management
- 📊 Advanced analytics (percentiles, trends)
- 🎨 Dark mode toggle
- 📧 Email notifications
- 🏆 Leaderboard system
- 📱 Mobile app (React Native)
- 🤖 AI-powered performance insights

---

## 📝 License

MIT © 2024

---

## 👨‍💻 Author

Built with ❤️ for internship preparation

**GitHub:** [Your GitHub Profile]  
**LinkedIn:** [Your LinkedIn Profile]

---

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

---

## 📞 Support

For questions or issues:
- Open a GitHub issue
- Contact via email
- Check existing documentation

---

**Happy coding! 🚀**
