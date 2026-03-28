const Student = require('../models/Student');
const Marks = require('../models/Marks');
const Attendance = require('../models/Attendance');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get marks for student
// @route   GET /api/marks/:studentId
// @access  Private Student/Parent
const getStudentMarks = asyncHandler(async (req, res) => {
    const { studentId } = req.params;

    // Verify ownership
    const student = await Student.findById(studentId).populate('parentId', 'role');
    if (!student) {
        res.status(404).json({ message: 'Student not found' });
        return;
    }

    if (req.user.role === 'student' && student.userId.toString() !== req.user.id.toString()) {
        res.status(403).json({ message: 'Not authorized' });
        return;
    }

    if (req.user.role === 'parent' && student.parentId._id.toString() !== req.user.id.toString()) {
        res.status(403).json({ message: 'Not authorized' });
        return;
    }

    const marks = await Marks.find({ studentId }).populate('studentId', 'name class').sort({ createdAt: -1 });
    res.json(marks);
});

// @desc    Get attendance for student
// @route   GET /api/attendance/:studentId
// @access  Private Student/Parent
const getStudentAttendance = asyncHandler(async (req, res) => {
    const { studentId } = req.params;

    // Verify ownership (same as above)
    const student = await Student.findById(studentId).populate('parentId', 'role');
    if (!student) {
        res.status(404).json({ message: 'Student not found' });
        return;
    }

    if (req.user.role === 'student' && student.userId.toString() !== req.user.id.toString()) {
        res.status(403).json({ message: 'Not authorized' });
        return;
    }

    if (req.user.role === 'parent' && student.parentId._id.toString() !== req.user.id.toString()) {
        res.status(403).json({ message: 'Not authorized' });
        return;
    }

    const attendance = await Attendance.find({ studentId }).sort({ date: -1 }).limit(30);
    res.json(attendance);
});

module.exports = {
    getStudentMarks,
    getStudentAttendance
};
