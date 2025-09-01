const http = require('http');

function testOTP() {
  const data = JSON.stringify({email: 'test@example.com'});
  
  const options = {
    hostname: 'localhost',
    port: 5001,
    path: '/api/auth/send-otp',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  console.log('🧪 Testing OTP endpoint...');
  console.log('📧 Email: test@example.com');
  console.log('🔗 URL: http://localhost:5001/api/auth/send-otp\n');

  const req = http.request(options, (res) => {
    console.log(`📈 Status Code: ${res.statusCode}`);
    console.log(`📋 Headers:`, res.headers);
    
    let responseData = '';
    res.on('data', chunk => {
      responseData += chunk;
    });
    
    res.on('end', () => {
      try {
        const jsonResponse = JSON.parse(responseData);
        console.log('✅ Response:', JSON.stringify(jsonResponse, null, 2));
      } catch (e) {
        console.log('📄 Raw Response:', responseData);
      }
    });
  });

  req.on('error', (e) => {
    console.error('❌ Request Error:', e.message);
  });

  req.write(data);
  req.end();
}

// Test the health endpoint first
function testHealth() {
  const options = {
    hostname: 'localhost',
    port: 5001,
    path: '/api/health',
    method: 'GET'
  };

  console.log('🔍 Testing health endpoint...\n');

  const req = http.request(options, (res) => {
    console.log(`📈 Health Status: ${res.statusCode}`);
    
    let responseData = '';
    res.on('data', chunk => {
      responseData += chunk;
    });
    
    res.on('end', () => {
      try {
        const jsonResponse = JSON.parse(responseData);
        console.log('✅ Health Response:', JSON.stringify(jsonResponse, null, 2));
        console.log('\n' + '='.repeat(50) + '\n');
        
        // If health check passes, test OTP
        testOTP();
      } catch (e) {
        console.log('📄 Raw Health Response:', responseData);
      }
    });
  });

  req.on('error', (e) => {
    console.error('❌ Health Check Error:', e.message);
  });

  req.end();
}

// Start testing
testHealth();
