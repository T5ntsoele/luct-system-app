// Check courses and faculty matching in database
const db = require('./config/db');
require('dotenv').config();

async function checkCourses() {
  try {
    console.log('🔍 Checking Courses and Faculty Matching...\n');

    // 1. Check all courses
    console.log('1️⃣ All courses in database:');
    const allCourses = await db.query(`
      SELECT c.id, c.course_code, c.course_name, c.faculty, c.lecturer_id,
             u.name || ' ' || u.surname AS lecturer_name
      FROM courses c
      LEFT JOIN users u ON c.lecturer_id = u.id
      ORDER BY c.faculty, c.course_code
    `);
    
    allCourses.rows.forEach(course => {
      console.log(`   📖 ${course.course_code}: ${course.course_name}`);
      console.log(`      🏫 Faculty: ${course.faculty}`);
      console.log(`      👨‍🏫 Lecturer: ${course.lecturer_name || 'None assigned'}`);
      console.log(`      🆔 Course ID: ${course.id}, Lecturer ID: ${course.lecturer_id}`);
      console.log('');
    });

    // 2. Check PRL user details
    console.log('2️⃣ PRL (Thabo) details:');
    const prl = await db.query(`
      SELECT id, name, surname, email, faculty, role 
      FROM users 
      WHERE email = 'thabo.prl@luct.ls'
    `);
    
    if (prl.rows.length > 0) {
      const prlUser = prl.rows[0];
      console.log(`   👤 ${prlUser.name} ${prlUser.surname}`);
      console.log(`   📧 ${prlUser.email}`);
      console.log(`   🏫 Faculty: "${prlUser.faculty}"`);
      console.log(`   👑 Role: ${prlUser.role}`);
      console.log('');

      // 3. Test the exact query used by PRL controller
      console.log('3️⃣ Testing PRL courses query:');
      const prlCourses = await db.query(`
        SELECT 
           c.id,
           c.course_code,
           c.course_name,
           c.faculty,
           u.name || ' ' || u.surname AS lecturer_name
         FROM courses c
         LEFT JOIN users u ON c.lecturer_id = u.id
         WHERE c.faculty = $1
         ORDER BY c.course_name
      `, [prlUser.faculty]);

      console.log(`   🎯 Query: WHERE c.faculty = '${prlUser.faculty}'`);
      console.log(`   📚 Found ${prlCourses.rows.length} courses:`);
      
      if (prlCourses.rows.length === 0) {
        console.log('   ❌ No courses found! Checking for faculty name mismatches...');
        
        // Check for similar faculty names
        const similarFaculties = await db.query(`
          SELECT DISTINCT faculty FROM courses 
          WHERE LOWER(faculty) LIKE LOWER($1)
        `, [`%${prlUser.faculty}%`]);
        
        console.log('   🔍 Similar faculty names in courses:');
        similarFaculties.rows.forEach(f => {
          console.log(`      - "${f.faculty}"`);
        });
        
      } else {
        prlCourses.rows.forEach((course, index) => {
          console.log(`   ${index + 1}. ${course.course_code}: ${course.course_name}`);
          console.log(`      👨‍🏫 ${course.lecturer_name || 'No lecturer'}`);
        });
      }
    }

  } catch (error) {
    console.error('❌ Database error:', error.message);
  } finally {
    process.exit(0);
  }
}

checkCourses();