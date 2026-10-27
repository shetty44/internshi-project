# 📋 Testing Guide

Quick reference for testing your Student Performance Dashboard API endpoints.

---

## Using Postman or Bruno

### 1. Authentication Endpoints

#### Register User

```
POST http://localhost:5500/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "65abc123...",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### Login

```
POST http://localhost:5500/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65abc123...",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

✅ **Copy the token for next requests**

---

### 2. Score Endpoints (Protected - Require Token)

#### Add Authorization Header

For all calls below, add:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Add Score

```
POST http://localhost:5500/api/scores
Content-Type: application/json
Authorization: Bearer <your_token>

{
  "subject": "Math",
  "score": 85,
  "timeSpent": 60
}
```

**Response:**
```json
{
  "message": "Score recorded successfully",
  "score": {
    "_id": "65abc456...",
    "userId": "65abc123...",
    "subject": "Math",
    "score": 85,
    "timeSpent": 60,
    "category": "Excellent",
    "date": "2024-01-20T10:30:00Z"
  }
}
```

#### Get All Scores

```
GET http://localhost:5500/api/scores
Authorization: Bearer <your_token>
```

**Response:**
```json
{
  "message": "Scores retrieved successfully",
  "scores": [
    {
      "_id": "65abc456...",
      "userId": "65abc123...",
      "subject": "Math",
      "score": 85,
      "timeSpent": 60,
      "category": "Excellent",
      "date": "2024-01-20T10:30:00Z"
    }
  ]
}
```

#### Get Analytics

```
GET http://localhost:5500/api/scores/analytics/summary
Authorization: Bearer <your_token>
```

**Response:**
```json
{
  "bestScore": 95,
  "averageScore": "82.50",
  "totalAssessments": 4,
  "totalTimeSpent": 240,
  "performanceByCategory": {
    "Excellent": 2,
    "Good": 1,
    "Average": 1
  }
}
```

#### Filter by Subject

```
GET http://localhost:5500/api/scores/filter/subject/Math
Authorization: Bearer <your_token>
```

#### Delete Score

```
DELETE http://localhost:5500/api/scores/65abc456...
Authorization: Bearer <your_token>
```

---

## Test Data

### Sample Users

```json
{
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "password": "alice123456"
}

{
  "name": "Bob Smith", 
  "email": "bob@example.com",
  "password": "bob123456"
}
```

### Sample Scores

```json
{"subject": "Math", "score": 95, "timeSpent": 45}
{"subject": "Science", "score": 88, "timeSpent": 50}
{"subject": "English", "score": 92, "timeSpent": 40}
{"subject": "History", "score": 78, "timeSpent": 55}
{"subject": "Programming", "score": 96, "timeSpent": 60}
```

---

## Frontend Testing Checklist

### Authentication
- [ ] Signup with new email
- [ ] Login with correct credentials
- [ ] Try login with wrong password
- [ ] Try login with non-existent email
- [ ] Token persists on page refresh
- [ ] Logout clears token

### Dashboard
- [ ] Dashboard loads after login
- [ ] User name displays correctly
- [ ] "+ Add Score" button works
- [ ] Score form submits successfully
- [ ] New score appears in list
- [ ] Charts update with new data
- [ ] Analytics cards update correctly

### Filtering
- [ ] Filter by subject works
- [ ] Filter shows correct scores
- [ ] "All" shows all scores
- [ ] Filtered scores display in chart

### UI/UX
- [ ] Mobile responsive
- [ ] Forms show error messages
- [ ] Loading states appear
- [ ] No console errors
- [ ] Smooth transitions
- [ ] All buttons clickable

---

## Automated Testing (Optional)

### Jest Test Example

```javascript
// tests/auth.test.js
const request = require('supertest');
const app = require('../server');

describe('Authentication', () => {
  test('Should register new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'test123456'
      });
    
    expect(res.statusCode).toBe(201);
    expect(res.body.user.email).toBe('test@example.com');
  });

  test('Should login user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'test123456'
      });
    
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});
```

Run:
```bash
npm test
```

---

## Performance Testing

### Load Testing with Apache Bench

```bash
# Test homepage
ab -n 1000 -c 10 http://localhost:3000/

# Test API
ab -n 1000 -c 10 http://localhost:5500/api/health
```

### Expected Results
- Response time: < 100ms
- Error rate: < 1%
- Throughput: > 100 req/s

---

## Security Testing

### CORS Headers
```bash
curl -H "Origin: http://example.com" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: X-Custom-Header" \
     -X OPTIONS http://localhost:5500/api/scores
```

### SQL Injection Test
Try in email field: `' OR '1'='1`
- Backend should reject (no SQL, using Mongoose)
- Frontend validation should catch it

### XSS Test
Add score with subject: `<script>alert('xss')</script>`
- Should render as text, not execute
- Check page source

---

## Browser DevTools

### Check Network Tab
- ✅ All requests successful (200-201 status)
- ✅ No CORS errors
- ✅ Token in Authorization header

### Check Console
- ✅ No errors or warnings
- ✅ API responses logged correctly

### Check Application/Storage
- ✅ Token saved in localStorage
- ✅ User data persists after refresh

---

## Debugging Tips

**Backend not responding:**
```bash
# Check if running
curl http://localhost:5500/api/health

# View logs
npm run dev
```

**Frontend not connecting:**
```javascript
// Check api.js baseURL
console.log(axios.defaults.baseURL);
```

**Authentication failing:**
```bash
# Check token format
localStorage.getItem('token')

# Verify JWT
jwt.io (paste token to decode)
```

---

**Happy testing! Report any issues! 🧪**
