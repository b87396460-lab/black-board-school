const User = require('../models/User');
const Teacher = require('../models/Teacher');
const Admission = require('../models/Admission');
const asyncHandler = require('../utils/asyncHandler');
const jwt = require('jsonwebtoken');

// @desc    Add teacher
// @route   POST /api/admin/add-teacher
// @access  Private Admin
const addTeacher = asyncHandler(async (req, res) => {
    const { name, email, password, subject } = req.body;

    // Create user
    const user = await User.create({
        name,
        email,
        password,
        role: 'teacher'
    });

    // Create teacher profile
    const teacher = await Teacher.create({
        userId: user._id,
        name,
        subject
    });

    const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
    );

    res.status(201).json({
        token,
        user,
        teacher
    });
});

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private Admin
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
});

module.exports = {
    addTeacher,
    getUsers
};
