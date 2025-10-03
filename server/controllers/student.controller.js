// server/controllers/student.controller.js
const db = require('../config/db');

const getMonitoring = async (req, res) => {
  try {
    // Get student's faculty
    const studentRes = await db.query('SELECT faculty FROM users WHERE id = $1', [req.user.id]);
    if (studentRes.rows.length === 0) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    const studentFaculty = studentRes.rows[0].faculty;

    // Fetch lectures in the same faculty
    const reports = await db.query(`
      SELECT 
        lr.id,
        c.course_name AS course,
        c.course_code,
        lr.date_of_lecture AS date,
        lr.week_of_reporting AS week,
        lr.topic_taught AS topic,
        lr.actual_students_present,
        lr.total_registered_students,
        u.name || ' ' || u.surname AS lecturer
      FROM lecture_reports lr
      JOIN courses c ON lr.course_id = c.id
      JOIN users u ON lr.lecturer_id = u.id
      WHERE c.faculty = $1
      ORDER BY lr.date_of_lecture DESC
    `, [studentFaculty]);

    res.json(reports.rows);
  } catch (err) {
    console.error('Student monitoring error:', err);
    res.status(500).json({ message: 'Failed to fetch monitoring data' });
  }
};

const submitRating = async (req, res) => {
  const { lecture_report_id, rating, comment } = req.body;
  const student_id = req.user.id;

  if (!lecture_report_id || !rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Invalid rating data. Rating must be 1-5.' });
  }

  try {
    // Verify report exists
    const report = await db.query('SELECT id FROM lecture_reports WHERE id = $1', [lecture_report_id]);
    if (report.rows.length === 0) {
      return res.status(404).json({ message: 'Lecture report not found' });
    }

    // Prevent duplicate rating
    const existing = await db.query(
      'SELECT id FROM ratings WHERE student_id = $1 AND lecture_report_id = $2',
      [student_id, lecture_report_id]
    );
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'You have already rated this lecture.' });
    }

    await db.query(
      'INSERT INTO ratings (student_id, lecture_report_id, rating, comment) VALUES ($1, $2, $3, $4)',
      [student_id, lecture_report_id, rating, comment || null]
    );

    res.status(201).json({ message: 'Rating submitted successfully' });
  } catch (err) {
    console.error('Rating submission error:', err);
    res.status(500).json({ message: 'Failed to submit rating' });
  }
};

const submitAttendance = async (req, res) => {
  const { lecture_report_id } = req.body;
  const student_id = req.user.id;

  if (!lecture_report_id) {
    return res.status(400).json({ message: 'Invalid attendance data. Lecture report ID is required.' });
  }

  try {
    // Ensure attendance table exists
    await db.query(`
      CREATE TABLE IF NOT EXISTS attendance (
        id SERIAL PRIMARY KEY,
        student_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        lecture_report_id INTEGER NOT NULL REFERENCES lecture_reports(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(student_id, lecture_report_id)
      )
    `);

    // Verify report exists
    const report = await db.query('SELECT id FROM lecture_reports WHERE id = $1', [lecture_report_id]);
    if (report.rows.length === 0) {
      return res.status(404).json({ message: 'Lecture report not found' });
    }

    // Prevent duplicate attendance
    const existing = await db.query(
      'SELECT id FROM attendance WHERE student_id = $1 AND lecture_report_id = $2',
      [student_id, lecture_report_id]
    );
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'You have already submitted attendance for this lecture.' });
    }

    await db.query(
      'INSERT INTO attendance (student_id, lecture_report_id) VALUES ($1, $2)',
      [student_id, lecture_report_id]
    );

    // Update lecture_reports.actual_students_present
    const updatedReport = await db.query(
      'UPDATE lecture_reports SET actual_students_present = (SELECT COUNT(*) FROM attendance WHERE lecture_report_id = $1) WHERE id = $1 RETURNING *',
      [lecture_report_id]
    );

    res.status(201).json({ message: 'Attendance submitted successfully', updatedReport: updatedReport.rows[0] });
  } catch (err) {
    console.error('Attendance submission error:', err);
    res.status(500).json({ message: 'Failed to submit attendance' });
  }
};

module.exports = { getMonitoring, submitRating, submitAttendance };