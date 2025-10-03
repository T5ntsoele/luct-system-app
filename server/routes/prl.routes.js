// server/routes/prl.routes.js
const express = require('express');
const auth = require('../middleware/auth');
const {
  getCourses,
  getReports,
  addFeedback,
  getMonitoring,
  getRating,
  getClasses
} = require('../controllers/prl.controller');

const router = express.Router();

// GET /api/prl/courses → View all courses & lectures under PRL's stream
router.get('/courses', auth, getCourses);

// GET /api/prl/reports → View lecture reports from lecturers
router.get('/reports', auth, getReports);

// POST /api/prl/reports/feedback → Add feedback to a report
router.post('/reports/feedback', auth, addFeedback);

// GET /api/prl/monitoring → Monitoring dashboard
router.get('/monitoring', auth, getMonitoring);

// GET /api/prl/rating → View rating summary
router.get('/rating', auth, getRating);

// GET /api/prl/classes → View classes in stream
router.get('/classes', auth, getClasses);

module.exports = router;