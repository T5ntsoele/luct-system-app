// server/controllers/auth.controller.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
require('dotenv').config();

const VALID_ROLES = ['student', 'lecturer', 'prl', 'pl'];

const register = async (req, res) => {
  const { name, surname, email, studentNumber, faculty, password, role } = req.body;

  // Validate role
  if (!VALID_ROLES.includes(role)) {
    return res.status(400).json({ message: 'Invalid role. Must be one of: student, lecturer, prl, pl.' });
  }

  // Validate required fields
  if (!name || !surname || !email || !faculty || !password) {
    return res.status(400).json({ message: 'Name, surname, email, faculty, and password are required.' });
  }

  // Student-specific validation
  if (role === 'student' && !studentNumber) {
    return res.status(400).json({ message: 'Student Number is required for students.' });
  }

  try {
    // Check if user already exists
    const userExists = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists with this email.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user (student_number is NULL for non-students)
    const newUser = await db.query(
      `INSERT INTO users (name, surname, email, student_number, faculty, password_hash, role)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, name, surname, email, role, faculty`,
      [
        name,
        surname,
        email,
        role === 'student' ? studentNumber : null, // Only students have student_number
        faculty,
        hashedPassword,
        role
      ]
    );

    res.status(201).json({
      message: `${role.charAt(0).toUpperCase() + role.slice(1)} registered successfully`,
      user: newUser.rows[0]
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const userRes = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userRes.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const user = userRes.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE || '7d'
    });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        role: user.role,
        faculty: user.faculty
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
};

module.exports = { register, login };