const express = require('express');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');
const { createBlog } = require('../controllers/blogController');

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.post('/', createBlog);

module.exports = router;
