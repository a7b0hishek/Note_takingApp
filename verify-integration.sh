#!/bin/bash

echo "🚀 Note Taking App - Integration Verification"
echo "=============================================="
echo

# Check if backend is running
echo "📡 Testing Backend API..."
BACKEND_HEALTH=$(curl -s http://localhost:5001/api/health)
if [[ $? -eq 0 ]]; then
    echo "✅ Backend is running on port 5001"
    echo "   Response: $BACKEND_HEALTH"
else
    echo "❌ Backend is not responding on port 5001"
    exit 1
fi

echo

# Check if frontend is running
echo "🖥️  Testing Frontend..."
FRONTEND_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001)
if [[ $FRONTEND_RESPONSE -eq 200 ]]; then
    echo "✅ Frontend is running on port 3001"
else
    echo "❌ Frontend is not responding on port 3001"
    exit 1
fi

echo

# Test API root endpoint
echo "🔧 Testing API Endpoints..."
API_ROOT=$(curl -s http://localhost:5001/)
if echo "$API_ROOT" | grep -q "Note Taking App API"; then
    echo "✅ API root endpoint working"
else
    echo "❌ API root endpoint failed"
    exit 1
fi

echo

echo "🎉 Integration Verification Complete!"
echo "===========================================" 
echo "✅ All systems are operational"
echo
echo "📝 Access your applications:"
echo "   Frontend: http://localhost:3001"
echo "   Backend:  http://localhost:5001"
echo "   API Docs: http://localhost:5001/api/health"
echo
echo "🔑 Test the integration by:"
echo "   1. Go to http://localhost:3001"
echo "   2. Create a new account"
echo "   3. Add some notes"
echo "   4. Test search and filtering"
echo
