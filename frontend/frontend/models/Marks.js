const mongoose = require('mongoose');

const marksSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    marks: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    examType: {
        type: String,
        default: 'term'
    }
}, { timestamps: true });

module.exports = mongoose.model('Marks', marksSchema);
