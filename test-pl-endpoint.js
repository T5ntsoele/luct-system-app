// Test script to verify PL lecturers endpoint
const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testPLEndpoint() {
  try {
    console.log('🧪 Testing PL Lecturers Endpoint...\n');

    // 1. Login as PL
    console.log('1️⃣ Logging in as PL (Naledi)...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'naledi.pl@luct.ls',
      password: 'password123'
    });

    if (!loginResponse.data.token) {
      console.log('❌ Login failed');
      return;
    }

    console.log('✅ Login successful');
    console.log(`👤 User: ${loginResponse.data.user.name} ${loginResponse.data.user.surname}`);
    console.log(`🏫 Faculty: ${loginResponse.data.user.faculty}`);
    console.log(`👑 Role: ${loginResponse.data.user.role}\n`);

    const token = loginResponse.data.token;

    // 2. Test GET /pl/lecturers endpoint
    console.log('2️⃣ Fetching lecturers list...');
    const lecturersResponse = await axios.get(`${BASE_URL}/pl/lecturers`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const lecturers = lecturersResponse.data;
    console.log(`✅ Found ${lecturers.length} lecturers:\n`);

    lecturers.forEach((lecturer, index) => {
      console.log(`${index + 1}. ${lecturer.name} ${lecturer.surname}`);
      console.log(`   📧 Email: ${lecturer.email}`);
      console.log(`   🏫 Faculty: ${lecturer.faculty}`);
      console.log(`   🆔 ID: ${lecturer.id}`);
      
      if (lecturer.email === 'david.lecturer@luct.ls') {
        console.log(`   ⭐ This is David - the lecturer you should see! ⭐`);
      }
      console.log('');
    });

    // Check if David is in the list
    const davidLecturer = lecturers.find(l => l.email === 'david.lecturer@luct.ls');
    if (davidLecturer) {
      console.log('🎉 SUCCESS: David Radebe is in the lecturers list!');
      console.log('✅ You should now see him in the PL course assignment dropdown');
    } else {
      console.log('❌ ERROR: David Radebe not found in lecturers list');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data?.message || error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Make sure your backend server is running on http://localhost:5000');
    }
  }
}

testPLEndpoint();