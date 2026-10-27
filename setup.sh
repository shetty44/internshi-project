#!/bin/bash

echo "🚀 Setting up Student Performance Dashboard..."

# Backend setup
echo ""
echo "📦 Setting up Backend..."
cd backend
npm install
cp .env.example .env
echo "✅ Backend setup complete"

# Frontend setup
echo ""
echo "📦 Setting up Frontend..."
cd ../frontend
npm install
echo "✅ Frontend setup complete"

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Edit backend/.env with your MongoDB URI"
echo "2. In one terminal: cd backend && npm run dev"
echo "3. In another terminal: cd frontend && npm start"
echo "4. Open http://localhost:3000"
echo ""
echo "🚀 Happy coding!"
