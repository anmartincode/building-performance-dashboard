#!/bin/bash

# Building Performance Dashboard - Server Startup Script
echo "🚀 Starting Building Performance Dashboard Servers..."

# Function to check if a port is in use
check_port() {
    lsof -i :$1 > /dev/null 2>&1
}

# Check if Python backend is running
if check_port 8000; then
    echo "✅ Python Backend (FastAPI) is already running on http://localhost:8000"
else
    echo "🔧 Starting Python Backend..."
    cd backend
    python3 main.py &
    BACKEND_PID=$!
    cd ..
    echo "✅ Python Backend started with PID: $BACKEND_PID"
fi

# Wait a moment for backend to start
sleep 2

# Check if React frontend is running
if check_port 3000; then
    echo "✅ React Frontend is already running on http://localhost:3000"
else
    echo "🔧 Starting React Frontend..."
    export PATH="/opt/homebrew/bin:$PATH"
    npm start &
    FRONTEND_PID=$!
    echo "✅ React Frontend started with PID: $FRONTEND_PID"
fi

echo ""
echo "🎉 Both servers are now running!"
echo ""
echo "📊 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:8000"
echo "📚 API Documentation: http://localhost:8000/docs"
echo ""
echo "🔐 Demo Login Credentials:"
echo "   Admin: admin / admin123"
echo "   Manager: facility_manager / fm123"
echo "   Tech: technician / tech123"
echo "   Guest: guest / guest123"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Wait for user to stop
wait 