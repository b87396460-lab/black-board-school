const express = require('express');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');
const { addStudent, addMarks, markAttendance } = require('../controllers/teacherController');

const router = express.Router();

router.use(protect);
router.use(authorize('teacher'));

router.post('/add-student', addStudent);
router.post('/marks', addMarks);
router.post('/attendance', markAttendance);

module.exports = router;
