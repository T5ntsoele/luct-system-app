// Check users in database
const db = require('./config/db');
require('dotenv').config();

async function checkUsers() {
  try {
    console.log('🔍 Checking database connection and users...\n');
    
    // Test database connection
    const result = await db.query('SELECT NOW()');
    console.log('✅ Database connection successful');
    console.log('📅 Server time:', result.rows[0].now);
    
    // Check if users table exists
    const tableCheck = await db.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'users'
    `);
    
    if (tableCheck.rows.length === 0) {
      console.log('❌ Users table does not exist!');
      console.log('📋 You need to create the database tables first.');
      return;
    }
    
    console.log('✅ Users table exists\n');
    
    // Check users in database
    const users = await db.query('SELECT id, name, surname, email, role, faculty FROM users ORDER BY role');
    
    if (users.rows.length === 0) {
      console.log('❌ No users found in database!');
      return;
    }
    
    console.log(`📊 Found ${users.rows.length} users in database:\n`);
    
    users.rows.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} ${user.surname}`);
      console.log(`   📧 Email: ${user.email}`);
      console.log(`   👤 Role: ${user.role}`);
      console.log(`   🏫 Faculty: ${user.faculty}`);
      console.log('');
    });
    
    // Test password verification for lecturer
    const bcrypt = require('bcryptjs');
    const lecturer = users.rows.find(u => u.email === 'david.lecturer@luct.ls');
    
    if (lecturer) {
      const passwordResult = await db.query('SELECT password_hash FROM users WHERE email = $1', ['david.lecturer@luct.ls']);
      if (passwordResult.rows.length > 0) {
        const isValidPassword = bcrypt.compareSync('password123', passwordResult.rows[0].password_hash);
        console.log(`🔐 Password test for lecturer: ${isValidPassword ? '✅ Valid' : '❌ Invalid'}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Database error:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Suggestions:');
      console.log('   - Make sure PostgreSQL is running');
      console.log('   - Check database credentials in .env file');
      console.log('   - Verify database "luct_system_app" exists');
    }
  } finally {
    process.exit(0);
  }
}

checkUsers();