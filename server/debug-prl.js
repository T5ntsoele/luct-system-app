// Debug PRL endpoint step by step
const db = require('./config/db');
const jwt = require('jsonwebtoken');
require('dotenv').config();

async function debugPRL() {
  try {
    console.log('🔧 Debugging PRL Courses Endpoint...\n');

    // 1. Test database connection
    console.log('1️⃣ Testing database connection...');
    await db.query('SELECT NOW()');
    console.log('✅ Database connected\n');

    // 2. Get PRL user
    console.log('2️⃣ Getting PRL user details...');
    const prlUser = await db.query(`
      SELECT id, name, surname, email, faculty, role 
      FROM users 
      WHERE email = 'thabo.prl@luct.ls'
    `);

    if (prlUser.rows.length === 0) {
      console.log('❌ PRL user not found!');
      return;
    }

    const user = prlUser.rows[0];
    console.log(`✅ Found user: ${user.name} ${user.surname}`);
    console.log(`   Faculty: "${user.faculty}"`);
    console.log(`   Role: ${user.role}\n`);

    // 3. Test the exact PRL courses query
    console.log('3️⃣ Testing PRL courses query...');
    const coursesQuery = `
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
    `;

    console.log(`Query: ${coursesQuery.replace(/\s+/g, ' ').trim()}`);
    console.log(`Parameter: faculty = "${user.faculty}"`);

    const courses = await db.query(coursesQuery, [user.faculty]);
    console.log(`Result: ${courses.rows.length} courses found\n`);

    if (courses.rows.length === 0) {
      console.log('❌ No courses found. Checking for data issues...');
      
      // Check all courses
      const allCourses = await db.query('SELECT course_code, course_name, faculty FROM courses');
      console.log('\n📚 All courses in database:');
      allCourses.rows.forEach(c => {
        console.log(`   ${c.course_code}: ${c.course_name} (Faculty: "${c.faculty}")`);
      });

      // Check for faculty mismatches
      console.log('\n🔍 Faculty comparison:');
      console.log(`   PRL Faculty: "${user.faculty}" (length: ${user.faculty.length})`);
      allCourses.rows.forEach(c => {
        console.log(`   Course Faculty: "${c.faculty}" (length: ${c.faculty.length}) - Match: ${c.faculty === user.faculty}`);
      });
      
    } else {
      console.log('✅ Courses found:');
      courses.rows.forEach((course, index) => {
        console.log(`   ${index + 1}. ${course.course_code}: ${course.course_name}`);
        console.log(`      Faculty: "${course.faculty}"`);
        console.log(`      Lecturer: ${course.lecturer_name || 'None'}`);
      });
    }

    // 4. Test JWT token generation
    console.log('\n4️⃣ Testing JWT token...');
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log(`✅ Token generated: ${token.substring(0, 20)}...`);

    // 5. Simulate the full controller function
    console.log('\n5️⃣ Simulating PRL controller...');
    const mockReq = {
      user: { id: user.id, faculty: user.faculty }
    };
    
    const mockRes = {
      json: (data) => {
        console.log('✅ Controller would return:');
        console.log(JSON.stringify(data, null, 2));
      },
      status: (code) => ({
        json: (data) => {
          console.log(`❌ Controller error (${code}):`, data);
        }
      })
    };

    // Run the actual controller logic
    try {
      const result = await db.query(coursesQuery, [mockReq.user.faculty]);
      mockRes.json(result.rows);
    } catch (err) {
      console.error('Controller error:', err);
      mockRes.status(500).json({ message: 'Failed to fetch courses' });
    }

  } catch (error) {
    console.error('❌ Debug error:', error.message);
    console.error(error.stack);
  } finally {
    process.exit(0);
  }
}

debugPRL();