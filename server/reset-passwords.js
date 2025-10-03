// Reset passwords for test users
const bcrypt = require('bcryptjs');
const db = require('./config/db');
require('dotenv').config();

async function resetPasswords() {
  try {
    console.log('🔧 Resetting passwords for test users...\n');
    
    const testPassword = 'password123';
    const hashedPassword = await bcrypt.hash(testPassword, 10);
    
    const testUsers = [
      'david.lecturer@luct.ls',
      'thabo.prl@luct.ls',
      'naledi.pl@luct.ls'
    ];
    
    for (const email of testUsers) {
      const result = await db.query(
        'UPDATE users SET password_hash = $1 WHERE email = $2 RETURNING name, surname, email, role',
        [hashedPassword, email]
      );
      
      if (result.rows.length > 0) {
        const user = result.rows[0];
        console.log(`✅ Updated password for: ${user.name} ${user.surname} (${user.role})`);
        console.log(`   📧 Email: ${user.email}`);
        console.log(`   🔐 Password: ${testPassword}`);
        
        // Test the password immediately
        const testResult = await db.query('SELECT password_hash FROM users WHERE email = $1', [email]);
        const isValid = await bcrypt.compare(testPassword, testResult.rows[0].password_hash);
        console.log(`   ✔️  Password test: ${isValid ? 'PASS' : 'FAIL'}`);
        console.log('');
      } else {
        console.log(`❌ User not found: ${email}`);
      }
    }
    
    console.log('🎉 Password reset complete!');
    console.log('');
    console.log('📋 You can now login with:');
    console.log('   👨‍🏫 Lecturer: david.lecturer@luct.ls / password123');
    console.log('   👨‍💼 PRL: thabo.prl@luct.ls / password123');  
    console.log('   👩‍💼 PL: naledi.pl@luct.ls / password123');
    
  } catch (error) {
    console.error('❌ Error resetting passwords:', error.message);
  } finally {
    process.exit(0);
  }
}

resetPasswords();