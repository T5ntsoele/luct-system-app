// server/routes/student.routes.js
const express = require('express');
const { getMonitoring, submitRating, submitAttendance } = require('../controllers/student.controller');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/monitoring', auth, getMonitoring);
router.post('/rating', auth, submitRating);
router.post('/attendance', auth, submitAttendance);

module.exports = router;