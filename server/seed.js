// server/seed.js
const bcrypt = require('bcryptjs');
const db = require('./config/db');

const seedUsers = async () => {
  const hash = await bcrypt.hash('password123', 10);
  await db.query(
    `INSERT INTO users (name, surname, email, faculty, password_hash, role)
     VALUES
      ('David', 'Radebe', 'david.lecturer@luct.ls', 'ICT', $1, 'lecturer'),
      ('Thabo', 'Mokoena', 'thabo.prl@luct.ls', 'ICT', $1, 'prl'),
      ('Naledi', 'Khumalo', 'naledi.pl@luct.ls', 'ICT', $1, 'pl'),
      ('John', 'Doe', 'john.student@luct.ls', 'ICT', $1, 'student')
     ON CONFLICT (email) DO NOTHING`,
    [hash]
  );
  console.log('✅ Seed users created');
};

seedUsers();