// server/controllers/pl.controller.js
const db = require('../config/db');
const bcrypt = require('bcryptjs');

const assignCourse = async (req, res) => {
  const { course_code, course_name, lecturer_id } = req.body;
  const faculty = req.user?.faculty;
  if (!course_code || !course_name || !lecturer_id || !faculty) {
    return res.status(400).json({ message: 'Course code, course name, lecturer and faculty required' });
  }

  try {
    // Verify lecturer exists and is in same faculty
    const lecturerCheck = await db.query(
      'SELECT id FROM users WHERE id = $1 AND faculty = $2 AND role = $3',
      [lecturer_id, faculty, 'lecturer']
    );
    if (lecturerCheck.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid lecturer or faculty mismatch' });
    }

    await db.query(
      `INSERT INTO courses (course_code, course_name, faculty, lecturer_id)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (course_code) DO UPDATE
       SET faculty = EXCLUDED.faculty, course_name = EXCLUDED.course_name, lecturer_id = EXCLUDED.lecturer_id`,
      [course_code, course_name, faculty, lecturer_id]
    );

    res.status(201).json({ message: 'Course assigned successfully' });
  } catch (err) {
    console.error('Assign course error:', err);
    res.status(500).json({ message: 'Failed to assign course' });
  }
};

const addLecturer = async (req, res) => {
  const { name, surname, email, password = 'default123' } = req.body;
  const faculty = req.user?.faculty;
  if (!name || !surname || !email || !faculty) {
    return res.status(400).json({ message: 'Name, surname, email, and faculty required' });
  }

  try {
    const hashedPassword = bcrypt.hashSync(password, 10);
    await db.query(
      `INSERT INTO users (name, surname, email, faculty, password_hash, role)
       VALUES ($1, $2, $3, $4, $5, 'lecturer')`,
      [name, surname, email, faculty, hashedPassword]
    );
    res.status(201).json({ message: 'Lecturer added successfully' });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ message: 'Email already exists' });
    }
    console.error('Add lecturer error:', err);
    res.status(500).json({ message: 'Failed to add lecturer' });
  }
};

// PL: View reports from PRLs (i.e., all reports with prl_feedback)
const getReports = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT c.faculty, c.course_name, u.name AS lecturer,
              lr.prl_feedback, lr.date_of_lecture
       FROM lecture_reports lr
       JOIN courses c ON lr.course_id = c.id
       JOIN users u ON lr.lecturer_id = u.id
       WHERE lr.prl_feedback IS NOT NULL
       ORDER BY lr.date_of_lecture DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('PL reports error:', err);
    res.status(500).json({ message: 'Failed to fetch reports' });
  }
};

// PL: Faculty-wide monitoring
const getMonitoring = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT c.faculty, c.course_name, 
              AVG(lr.actual_students_present::FLOAT / lr.total_registered_students * 100) AS avg_attendance
       FROM lecture_reports lr
       JOIN courses c ON lr.course_id = c.id
       GROUP BY c.faculty, c.course_name
       ORDER BY c.faculty`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('PL monitoring error:', err);
    res.status(500).json({ message: 'Failed to fetch monitoring data' });
  }
};

// PL: All classes
const getClasses = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT c.course_code, c.course_name, c.faculty, 
              u.name || ' ' || u.surname AS lecturer
       FROM courses c
       LEFT JOIN users u ON c.lecturer_id = u.id
       ORDER BY c.faculty, c.course_name`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('PL classes error:', err);
    res.status(500).json({ message: 'Failed to fetch classes' });
  }
};

// PL: Rating summary
const getRating = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT c.course_name, c.faculty, 
              AVG(r.rating) AS avg_rating, COUNT(r.id) AS feedback_count
       FROM ratings r
       JOIN lecture_reports lr ON r.lecture_report_id = lr.id
       JOIN courses c ON lr.course_id = c.id
       GROUP BY c.course_name, c.faculty
       ORDER BY avg_rating DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('PL rating error:', err);
    res.status(500).json({ message: 'Failed to fetch rating summary' });
  }
};

// PL: Get all lecturers (PLs can assign courses to any lecturer)
const getLecturers = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id, name, surname, email, faculty, created_at
       FROM users 
       WHERE role = 'lecturer'
       ORDER BY created_at DESC, faculty, name, surname`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('PL get lecturers error:', err);
    res.status(500).json({ message: 'Failed to fetch lecturers' });
  }
};

module.exports = { assignCourse, addLecturer, getLecturers, getReports, getMonitoring, getClasses, getRating };
