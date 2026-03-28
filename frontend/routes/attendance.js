const express = require('express');
const { protect } = require('../middleware/auth');
const { getStudentAttendance } = require('../controllers/commonController');

const router = express.Router({ mergeParams: true });

router.use(protect);
router.get('/:studentId', getStudentAttendance);

module.exports = router;
