const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Teacher', teacherSchema);
