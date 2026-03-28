const express = require('express');
const Admission = require('../models/Admission');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');
const asyncHandler = require('../utils/asyncHandler');
const { submitAdmission } = require('../controllers/admissionController');

const router = express.Router();

router.post('/', submitAdmission); // public

// Admin get all
router.use(protect);
router.use(authorize('admin'));
router.get('/', asyncHandler(async (req, res) => {
    const admissions = await Admission.find().sort({ createdAt: -1 });
    res.json(admissions);
}));

module.exports = router;
