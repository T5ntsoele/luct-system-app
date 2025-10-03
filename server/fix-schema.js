// Fix database schema for LUCT system
const db = require('./config/db');
require('dotenv').config();

async function fixSchema() {
  try {
    console.log('🔧 Fixing LUCT System Database Schema...\n');

    // Check if lecturer_id column exists in courses table
    const columnCheck = await db.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'courses' 
      AND column_name = 'lecturer_id'
    `);

    if (columnCheck.rows.length === 0) {
      console.log('➕ Adding lecturer_id column to courses table...');
      await db.query(`
        ALTER TABLE courses 
        ADD COLUMN lecturer_id INTEGER REFERENCES users(id) ON DELETE SET NULL
      `);
      console.log('✅ lecturer_id column added');
    } else {
      console.log('✅ lecturer_id column already exists');
    }

    // Now insert sample data
    console.log('📚 Adding sample courses...');
    await db.query(`
      INSERT INTO courses (course_code, course_name, faculty, lecturer_id)
      VALUES 
        ('ICT101', 'Introduction to Computing', 'ICT', 
         (SELECT id FROM users WHERE email = 'david.lecturer@luct.ls' LIMIT 1)),
        ('ICT201', 'Web Development', 'ICT', 
         (SELECT id FROM users WHERE email = 'david.lecturer@luct.ls' LIMIT 1)),
        ('ICT301', 'Database Systems', 'ICT', 
         (SELECT id FROM users WHERE email = 'david.lecturer@luct.ls' LIMIT 1))
      ON CONFLICT (course_code) DO NOTHING
    `);
    console.log('✅ Sample courses added');

    // Insert a sample lecture report
    console.log('📝 Adding sample lecture report...');
    
    // First check if any reports exist
    const reportExists = await db.query('SELECT COUNT(*) FROM lecture_reports');
    
    if (parseInt(reportExists.rows[0].count) === 0) {
      await db.query(`
        INSERT INTO lecture_reports (
          faculty_name, class_name, week_of_reporting, date_of_lecture,
          course_id, lecturer_id, actual_students_present, total_registered_students,
          venue, scheduled_time, topic_taught, learning_outcomes, lecturer_recommendations
        )
        VALUES (
          'ICT', 'ICT101 Morning', 1, CURRENT_DATE - INTERVAL '7 days',
          (SELECT id FROM courses WHERE course_code = 'ICT101' LIMIT 1),
          (SELECT id FROM users WHERE email = 'david.lecturer@luct.ls' LIMIT 1),
          25, 30, 'Room 101', '08:00 - 10:00',
          'Introduction to Computer Systems and Basic Programming Concepts',
          'Students will understand basic computer architecture and can write simple programs',
          'Need more practical exercises for better engagement'
        )
      `);
      console.log('✅ Sample lecture report added');
    } else {
      console.log('✅ Lecture reports already exist');
    }

    // Verify everything is working
    console.log('\n🧪 Testing database integrity...');
    
    const courseCount = await db.query(`
      SELECT c.course_code, c.course_name, u.name || ' ' || u.surname as lecturer_name
      FROM courses c
      LEFT JOIN users u ON c.lecturer_id = u.id
      ORDER BY c.course_code
    `);
    
    console.log('\n📚 Available courses:');
    courseCount.rows.forEach(course => {
      console.log(`   📖 ${course.course_code}: ${course.course_name} (${course.lecturer_name || 'No lecturer'})`);
    });

    const reportCount = await db.query(`
      SELECT lr.id, c.course_code, lr.date_of_lecture, lr.actual_students_present, lr.total_registered_students
      FROM lecture_reports lr
      JOIN courses c ON lr.course_id = c.id
      ORDER BY lr.date_of_lecture DESC
      LIMIT 5
    `);
    
    console.log('\n📝 Recent reports:');
    reportCount.rows.forEach(report => {
      console.log(`   📊 ${report.course_code} - ${report.date_of_lecture}: ${report.actual_students_present}/${report.total_registered_students} students`);
    });

    console.log('\n🎉 Database schema fixed successfully!');
    
  } catch (error) {
    console.error('❌ Error fixing schema:', error.message);
    console.error(error.stack);
  } finally {
    process.exit(0);
  }
}

fixSchema();