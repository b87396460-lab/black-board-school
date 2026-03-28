const User = require('../models/User');
const Student = require('../models/Student');
const Marks = require('../models/Marks');
const Attendance = require('../models/Attendance');
const asyncHandler = require('../utils/asyncHandler');
const jwt = require('jsonwebtoken');

// @desc    Add student by teacher
// @route   POST /api/teacher/add-student
// @access  Private Teacher
const addStudent = asyncHandler(async (req, res) => {
    const { name, email, password, class: className, parentId } = req.body;

    // Verify parent exists
    const parent = await User.findById(parentId);
    if (!parent || parent.role !== 'parent') {
        res.status(400).json({ message: 'Invalid parent' });
        return;
    }

    // Create user
    const user = await User.create({
        name,
        email,
        password,
        role: 'student'
    });

    // Create student profile
    const student = await Student.create({
        userId: user._id,
        name,
        class: className,
        parentId
    });

    const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
    );

    res.status(201).json({
        token,
        user,
        student
    });
});

// @desc    Add marks
// @route   POST /api/marks
// @access  Private Teacher
const addMarks = asyncHandler(async (req, res) => {
    const { studentId, subject, marks, examType } = req.body;

    const marksRecord = await Marks.create({
        studentId,
        subject,
        marks,
        examType
    });

    res.status(201).json(marksRecord);
});

// @desc    Mark attendance
// @route   POST /api/attendance
// @access  Private Teacher
const markAttendance = asyncHandler(async (req, res) => {
    const { studentId, date, status } = req.body;
    const attendanceDate = date || new Date().toISOString().split('T')[0]; // today default

    const attendance = await Attendance.findOneAndUpdate(
        { studentId, date: attendanceDate },
        { status },
        { upsert: true, new: true }
    );

    res.status(201).json(attendance);
});

module.exports = {
    addStudent,
    addMarks,
    markAttendance
};
