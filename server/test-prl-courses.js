// Test script to verify PRL courses view
const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testPRLCourses() {
  try {
    console.log('🧪 Testing PRL Courses View...\n');

    // 1. Login as PRL (Thabo)
    console.log('1️⃣ Logging in as PRL (Thabo)...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'thabo.prl@luct.ls',
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

    // 2. Test GET /prl/courses endpoint
    console.log('2️⃣ Fetching courses in PRL\'s faculty...');
    const coursesResponse = await axios.get(`${BASE_URL}/prl/courses`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const courses = coursesResponse.data;
    console.log(`✅ Found ${courses.length} courses in ${loginResponse.data.user.faculty} faculty:\n`);

    if (courses.length === 0) {
      console.log('📭 No courses found in ICT faculty yet.');
      console.log('💡 You need to assign courses to lecturers as PL first.');
      return;
    }

    courses.forEach((course, index) => {
      console.log(`${index + 1}. 🏷️ Course Code: ${course.course_code}`);
      console.log(`   📖 Course Name: ${course.course_name}`);
      console.log(`   🏫 Faculty: ${course.faculty}`);
      console.log(`   👨‍🏫 Lecturer: ${course.lecturer_name || 'No lecturer assigned'}`);
      console.log(`   🆔 Course ID: ${course.id}`);
      console.log('');
    });

    console.log('🎉 SUCCESS: PRL can see all assigned courses with codes and lecturers!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data?.message || error.message);
  }
}

testPRLCourses();