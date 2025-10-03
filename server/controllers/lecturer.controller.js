// server/controllers/lecturer.controller.js
const db = require('../config/db');

const getClasses = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT c.id, c.course_code, c.course_name, c.faculty
       FROM courses c
       WHERE c.lecturer_id = $1`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch classes' });
  }
};

const submitReport = async (req, res) => {
  const {
    facultyName,
    className,
    weekOfReporting,
    dateOfLecture,
    courseId,
    actualStudentsPresent,
    totalRegisteredStudents,
    venue,
    scheduledTime,
    topicTaught,
    learningOutcomes,
    lecturerRecommendations
  } = req.body;

  // Validate required fields
  if (!facultyName || !className || !weekOfReporting || !dateOfLecture || 
      !courseId || actualStudentsPresent == null || totalRegisteredStudents == null ||
      !venue || !scheduledTime || !topicTaught) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // 1. Verify lecturer exists and get their faculty
    const lecturerRes = await db.query('SELECT faculty FROM users WHERE id = $1', [req.user.id]);
    if (lecturerRes.rows.length === 0) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    const lecturerFaculty = lecturerRes.rows[0].faculty;

    // 2. Enforce faculty consistency
    if (facultyName !== lecturerFaculty) {
      return res.status(400).json({ message: 'Faculty must match your assigned faculty' });
    }

    // 3. Verify course belongs to lecturer and faculty matches
    const courseCheck = await db.query(
      'SELECT id, faculty FROM courses WHERE id = $1 AND lecturer_id = $2',
      [courseId, req.user.id]
    );
    if (courseCheck.rows.length === 0) {
      return res.status(403).json({ message: 'Course not assigned to you' });
    }
    if (courseCheck.rows[0].faculty !== facultyName) {
      return res.status(400).json({ message: 'Course faculty mismatch' });
    }

    // 4. Insert the report
    const result = await db.query(
      `INSERT INTO lecture_reports (
        faculty_name, class_name, week_of_reporting, date_of_lecture,
        course_id, lecturer_id, actual_students_present, total_registered_students,
        venue, scheduled_time, topic_taught, learning_outcomes, lecturer_recommendations
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING id`,
      [
        facultyName, className, weekOfReporting, dateOfLecture,
        courseId, req.user.id, actualStudentsPresent, totalRegisteredStudents,
        venue, scheduledTime, topicTaught, learningOutcomes, lecturerRecommendations
      ]
    );

    res.status(201).json({ message: 'Report submitted successfully', reportId: result.rows[0].id });
  } catch (err) {
    console.error('Submit report error:', err);
    res.status(500).json({ message: 'Failed to submit report' });
  }
};

const getMonitoring = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT c.course_name, lr.date_of_lecture, lr.actual_students_present, lr.total_registered_students,
              ROUND((lr.actual_students_present::FLOAT / lr.total_registered_students) * 100, 2) AS attendance_pct
       FROM lecture_reports lr
       JOIN courses c ON lr.course_id = c.id
       WHERE lr.lecturer_id = $1
       ORDER BY lr.date_of_lecture DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Monitoring error:', err);
    res.status(500).json({ message: 'Failed to fetch monitoring data' });
  }
};

const getReports = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT 
         lr.id,
         lr.faculty_name,
         lr.class_name,
         lr.week_of_reporting,
         lr.date_of_lecture,
         lr.topic_taught,
         lr.learning_outcomes,
         lr.lecturer_recommendations,
         lr.actual_students_present,
         lr.total_registered_students,
         lr.venue,
         lr.scheduled_time,
         lr.prl_feedback,
         c.course_name,
         c.course_code,
         lr.created_at
       FROM lecture_reports lr
       JOIN courses c ON lr.course_id = c.id
       WHERE lr.lecturer_id = $1
       ORDER BY lr.date_of_lecture DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Get reports error:', err);
    res.status(500).json({ message: 'Failed to fetch reports' });
  }
};

const getRating = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT r.rating, r.comment, r.created_at, c.course_name
       FROM ratings r
       JOIN lecture_reports lr ON r.lecture_report_id = lr.id
       JOIN courses c ON lr.course_id = c.id
       WHERE lr.lecturer_id = $1
       ORDER BY r.created_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Rating error:', err);
    res.status(500).json({ message: 'Failed to fetch ratings' });
  }
};
const getLecturerCourses = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, course_name, course_code FROM courses WHERE lecturer_id = $1',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Failed to fetch lecturer courses:', err);
    res.status(500).json({ message: 'Failed to fetch courses' });
  }
};

const createLectureReport = async (req, res) => {
  const {
    course_id,
    date_of_lecture,
    week_of_reporting,
    topic_taught,
    actual_students_present,
    total_registered_students
  } = req.body;
  const lecturer_id = req.user.id;

  if (!course_id || !date_of_lecture || !week_of_reporting || !topic_taught || !actual_students_present || !total_registered_students) {
    return res.status(400).json({ message: 'Please provide all required fields.' });
  }

  try {
    await db.query(
      'INSERT INTO lecture_reports (course_id, lecturer_id, date_of_lecture, week_of_reporting, topic_taught, actual_students_present, total_registered_students) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [course_id, lecturer_id, date_of_lecture, week_of_reporting, topic_taught, actual_students_present, total_registered_students]
    );
    res.status(201).json({ message: 'Lecture report created successfully' });
  } catch (err) {
    console.error('Lecture report creation error:', err);
    res.status(500).json({ message: 'Failed to create lecture report' });
  }
};

module.exports = { getClasses, submitReport, getReports, getMonitoring, getRating, getLecturerCourses, createLectureReport };
