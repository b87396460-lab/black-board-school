const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');
const { addTeacher } = require('../controllers/adminController');

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.post('/add-teacher', addTeacher);
router.get('/users', asyncHandler(async (req, res) => {
    const { getUsers } = require('../controllers/adminController');
    getUsers(req, res);
}));

module.exports = router;
