// server/controllers/prl.controller.js
const db = require('../config/db');

// PRL: View all courses & lectures under their faculty (stream)
const getCourses = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT 
         c.id,
         c.course_code,
         c.course_name,
         c.faculty,
         u.name || ' ' || u.surname AS lecturer_name
       FROM courses c
       LEFT JOIN users u ON c.lecturer_id = u.id
       WHERE c.faculty = $1
       ORDER BY c.course_name`,
      [req.user.faculty]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('PRL courses error:', err);
    res.status(500).json({ message: 'Failed to fetch courses' });
  }
};

// PRL: View lecture reports from lecturers in their faculty
const getReports = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT 
         lr.id,
         c.course_name,
         c.course_code,
         lr.week_of_reporting,
         lr.date_of_lecture,
         lr.topic_taught,
         u.name || ' ' || u.surname AS lecturer_name,
         lr.actual_students_present,
         lr.total_registered_students,
         lr.prl_feedback
       FROM lecture_reports lr
       JOIN courses c ON lr.course_id = c.id
       JOIN users u ON lr.lecturer_id = u.id
       WHERE c.faculty = $1
       ORDER BY lr.date_of_lecture DESC`,
      [req.user.faculty]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('PRL reports error:', err);
    res.status(500).json({ message: 'Failed to fetch reports' });
  }
};

// PRL: Add feedback to a lecture report
const addFeedback = async (req, res) => {
  const { report_id, feedback } = req.body;

  if (!report_id || feedback === undefined) {
    return res.status(400).json({ message: 'Report ID and feedback are required' });
  }

  try {
    // Verify the report belongs to PRL's faculty
    const reportCheck = await db.query(
      `SELECT lr.id
       FROM lecture_reports lr
       JOIN courses c ON lr.course_id = c.id
       WHERE lr.id = $1 AND c.faculty = $2`,
      [report_id, req.user.faculty]
    );

    if (reportCheck.rows.length === 0) {
      return res.status(403).json({ message: 'Access denied: Report not in your faculty' });
    }

    // Update feedback
    await db.query(
      'UPDATE lecture_reports SET prl_feedback = $1 WHERE id = $2',
      [feedback, report_id]
    );

    res.json({ message: 'Feedback added successfully' });
  } catch (err) {
    console.error('PRL feedback error:', err);
    res.status(500).json({ message: 'Failed to add feedback' });
  }
};

// PRL: Monitoring dashboard (attendance trends in faculty)
const getMonitoring = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT 
         c.course_name,
         lr.date_of_lecture,
         lr.actual_students_present,
         lr.total_registered_students,
         ROUND((lr.actual_students_present::FLOAT / lr.total_registered_students) * 100, 2) AS attendance_pct
       FROM lecture_reports lr
       JOIN courses c ON lr.course_id = c.id
       WHERE c.faculty = $1
       ORDER BY lr.date_of_lecture DESC`,
      [req.user.faculty]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('PRL monitoring error:', err);
    res.status(500).json({ message: 'Failed to fetch monitoring data' });
  }
};

// PRL: View student ratings for lectures in their faculty
const getRating = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT 
         c.course_name,
         u.name || ' ' || u.surname AS lecturer,
         r.rating,
         r.comment,
         r.created_at
       FROM ratings r
       JOIN lecture_reports lr ON r.lecture_report_id = lr.id
       JOIN courses c ON lr.course_id = c.id
       JOIN users u ON lr.lecturer_id = u.id
       WHERE c.faculty = $1
       ORDER BY r.created_at DESC`,
      [req.user.faculty]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('PRL rating error:', err);
    res.status(500).json({ message: 'Failed to fetch ratings' });
  }
};

// PRL: Classes overview (same as courses but focused on schedule)
const getClasses = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT DISTINCT
         c.course_code,
         c.course_name,
         lr.venue,
         lr.scheduled_time,
         lr.date_of_lecture
       FROM lecture_reports lr
       JOIN courses c ON lr.course_id = c.id
       WHERE c.faculty = $1
       ORDER BY lr.date_of_lecture DESC`,
      [req.user.faculty]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('PRL classes error:', err);
    res.status(500).json({ message: 'Failed to fetch classes' });
  }
};

module.exports = {
  getCourses,
  getReports,
  addFeedback,
  getMonitoring,
  getRating,
  getClasses
};