// server/routes/lecturer.routes.js
const express = require('express');
const auth = require('../middleware/auth');
const {
  getClasses,
  submitReport,
  getReports,
  getMonitoring,
  getRating,
  getLecturerCourses,
  createLectureReport
} = require('../controllers/lecturer.controller');

const router = express.Router();

// GET /api/lecturer/classes → View assigned classes
router.get('/classes', auth, getClasses);

// This route is for the original complex report submission
router.post('/reports/detailed', auth, submitReport);

// This is the new simplified report submission
router.post('/reports', auth, createLectureReport);

// GET /api/lecturer/courses -> Get courses for a lecturer
router.get('/courses', auth, getLecturerCourses);
router.get('/monitoring', auth, getMonitoring);

// GET /api/lecturer/rating → View student ratings
router.get('/rating', auth, getRating);

module.exports = router;