// server/routes/pl.routes.js
const express = require('express');
const auth = require('../middleware/auth');
const {
  assignCourse,
  addLecturer,
  getLecturers,
  getReports,
  getMonitoring,
  getClasses,
  getRating
} = require('../controllers/pl.controller');

const router = express.Router();

// POST /api/pl/courses → Add/assign course to lecturer
router.post('/courses', auth, assignCourse);

// POST /api/pl/lectures → Add new lecturer (note: "lectures" = lecturer management)
router.post('/lectures', auth, addLecturer);

// GET /api/pl/lecturers → Get all lecturers for course assignment
router.get('/lecturers', auth, getLecturers);

// GET /api/pl/reports → View reports from PRLs
router.get('/reports', auth, getReports);

// GET /api/pl/monitoring → Faculty-wide monitoring
router.get('/monitoring', auth, getMonitoring);

// GET /api/pl/classes → View all classes
router.get('/classes', auth, getClasses);

// GET /api/pl/rating → View rating summary
router.get('/rating', auth, getRating);

module.exports = router;