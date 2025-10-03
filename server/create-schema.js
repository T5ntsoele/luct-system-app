// Create database schema for LUCT system
const db = require('./config/db');
require('dotenv').config();

async function createSchema() {
  try {
    console.log('🏗️  Creating LUCT System Database Schema...\n');

    // Create users table (already exists, but let's ensure it has all columns)
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        surname VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        student_number VARCHAR(50),
        faculty VARCHAR(100) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'lecturer', 'prl', 'pl')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Users table ready');

    // Create courses table
    await db.query(`
      CREATE TABLE IF NOT EXISTS courses (
        id SERIAL PRIMARY KEY,
        course_code VARCHAR(20) UNIQUE NOT NULL,
        course_name VARCHAR(255) NOT NULL,
        faculty VARCHAR(100) NOT NULL,
        lecturer_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Courses table created');

    // Create lecture_reports table
    await db.query(`
      CREATE TABLE IF NOT EXISTS lecture_reports (
        id SERIAL PRIMARY KEY,
        faculty_name VARCHAR(100) NOT NULL,
        class_name VARCHAR(255) NOT NULL,
        week_of_reporting INTEGER NOT NULL,
        date_of_lecture DATE NOT NULL,
        course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
        lecturer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        actual_students_present INTEGER NOT NULL,
        total_registered_students INTEGER NOT NULL,
        venue VARCHAR(255) NOT NULL,
        scheduled_time VARCHAR(50) NOT NULL,
        topic_taught TEXT NOT NULL,
        learning_outcomes TEXT,
        lecturer_recommendations TEXT,
        prl_feedback TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Lecture_reports table created');

    // Create ratings table
    await db.query(`
      CREATE TABLE IF NOT EXISTS ratings (
        id SERIAL PRIMARY KEY,
        student_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        lecture_report_id INTEGER NOT NULL REFERENCES lecture_reports(id) ON DELETE CASCADE,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(student_id, lecture_report_id)
      )
    `);
    console.log('✅ Ratings table created');

    // Insert sample courses if they don't exist
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
      ON CONFLICT DO NOTHING
    `);
    console.log('✅ Sample lecture report added');

    console.log('\n🎉 Database schema creation complete!');
    
    // Verify tables
    const tableCount = await db.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);
    
    console.log('\n📊 Created tables:');
    tableCount.rows.forEach(row => {
      console.log(`   📋 ${row.table_name}`);
    });

    // Check record counts
    const userCount = await db.query('SELECT COUNT(*) FROM users');
    const courseCount = await db.query('SELECT COUNT(*) FROM courses'); 
    const reportCount = await db.query('SELECT COUNT(*) FROM lecture_reports');
    const ratingCount = await db.query('SELECT COUNT(*) FROM ratings');

    console.log('\n📈 Record counts:');
    console.log(`   👥 Users: ${userCount.rows[0].count}`);
    console.log(`   📚 Courses: ${courseCount.rows[0].count}`);
    console.log(`   📝 Reports: ${reportCount.rows[0].count}`);
    console.log(`   ⭐ Ratings: ${ratingCount.rows[0].count}`);
    
  } catch (error) {
    console.error('❌ Error creating schema:', error.message);
  } finally {
    process.exit(0);
  }
}

createSchema();