// Test script to verify the LUCT system API endpoints
// Run this after starting the backend server

const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Test credentials (from seed data)
const testUsers = {
  lecturer: {
    email: 'david.lecturer@luct.ls',
    password: 'password123'
  },
  prl: {
    email: 'thabo.prl@luct.ls', 
    password: 'password123'
  },
  pl: {
    email: 'naledi.pl@luct.ls',
    password: 'password123'
  }
};

async function testEndpoint(name, url, token = null, method = 'GET', data = null) {
  try {
    const config = {
      method,
      url: `${BASE_URL}${url}`,
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    };
    
    if (data && (method === 'POST' || method === 'PUT')) {
      config.data = data;
    }

    const response = await axios(config);
    console.log(`✅ ${name}: ${response.status} - ${response.data?.length || 'OK'}`);
    return response.data;
  } catch (error) {
    console.log(`❌ ${name}: ${error.response?.status || 'ERROR'} - ${error.response?.data?.message || error.message}`);
    return null;
  }
}

async function testSystem() {
  console.log('🧪 Testing LUCT System API Endpoints\n');
  
  // 1. Test lecturer login and get token
  console.log('1️⃣ Testing Authentication...');
  const loginResponse = await testEndpoint(
    'Lecturer Login', 
    '/auth/login', 
    null, 
    'POST', 
    testUsers.lecturer
  );
  
  if (!loginResponse?.token) {
    console.log('❌ Cannot proceed without authentication token');
    return;
  }
  
  const lecturerToken = loginResponse.token;
  console.log('✅ Got lecturer authentication token\n');
  
  // 2. Test lecturer endpoints
  console.log('2️⃣ Testing Lecturer Endpoints...');
  await testEndpoint('Get Classes', '/lecturer/classes', lecturerToken);
  await testEndpoint('Get Reports', '/lecturer/reports', lecturerToken); // This is the new endpoint we added!
  await testEndpoint('Get Monitoring', '/lecturer/monitoring', lecturerToken);
  await testEndpoint('Get Ratings', '/lecturer/rating', lecturerToken);
  console.log('');
  
  // 3. Test PRL login and endpoints
  console.log('3️⃣ Testing PRL Endpoints...');
  const prlLogin = await testEndpoint('PRL Login', '/auth/login', null, 'POST', testUsers.prl);
  if (prlLogin?.token) {
    await testEndpoint('PRL Get Reports', '/prl/reports', prlLogin.token);
    await testEndpoint('PRL Get Courses', '/prl/courses', prlLogin.token);
    await testEndpoint('PRL Get Monitoring', '/prl/monitoring', prlLogin.token);
  }
  console.log('');
  
  // 4. Test student endpoints (will need a student account)
  console.log('4️⃣ Note: Student endpoints require a student account in the database');
  console.log('   - /student/monitoring (fixed to use real data)');
  console.log('   - /student/rating');
  
  console.log('\n🎉 API endpoint testing complete!');
  console.log('\n📋 Summary of fixes implemented:');
  console.log('   ✅ Added GET /lecturer/reports endpoint');
  console.log('   ✅ Enhanced lecturer Reports page with detailed view');
  console.log('   ✅ Fixed student monitoring to use real API data');
  console.log('   ✅ Added PRL feedback display in lecturer reports');
}

testSystem().catch(console.error);