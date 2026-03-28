const express = require('express');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');
const { addGalleryImage } = require('../controllers/galleryController');

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.post('/', addGalleryImage);

module.exports = router;
