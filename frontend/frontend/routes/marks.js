const express = require('express');
const { protect } = require('../middleware/auth');
const { getStudentMarks } = require('../controllers/commonController');

const router = express.Router({ mergeParams: true });

router.use(protect);
router.get('/:studentId', getStudentMarks);

module.exports = router;
