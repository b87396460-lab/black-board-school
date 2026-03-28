const Admission = require('../models/Admission');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Submit admission form
// @route   POST /api/admissions
// @access  Public
const submitAdmission = asyncHandler(async (req, res) => {
    const { studentName, class: className, parentName, phone, address } = req.body;

    const admission = await Admission.create({
        studentName,
        class: className,
        parentName,
        phone,
        address
    });

    res.status(201).json(admission);
});

// Use getAdmissions from here or keep in admin

module.exports = {
    submitAdmission,
    getAdmissions: require('./adminController').getAdmissions // temp, better move
};
