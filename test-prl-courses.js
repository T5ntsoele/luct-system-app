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
      console.log('📭 No courses found in your faculty.');
      console.log('💡 This means no courses have been assigned to lecturers in your faculty yet.');
      console.log('👉 As a PL, you need to assign courses to lecturers first.');
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

    // Show summary
    const assignedCourses = courses.filter(c => c.lecturer_name);
    const unassignedCourses = courses.filter(c => !c.lecturer_name);

    console.log('📊 SUMMARY:');
    console.log(`   ✅ Courses with lecturers: ${assignedCourses.length}`);
    console.log(`   ⚠️  Courses needing lecturers: ${unassignedCourses.length}`);
    console.log(`   📚 Total courses supervised: ${courses.length}`);

    if (assignedCourses.length > 0) {
      console.log('\n🎉 SUCCESS: You should see these courses in your PRL dashboard!');
      console.log('✅ The PRL Courses page will show all the course codes and lecturer assignments.');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data?.message || error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Make sure your backend server is running on http://localhost:5000');
    }
  }
}

testPRLCourses();