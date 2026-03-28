const mongoose = require('mongoose');

const admissionSchema = new mongoose.Schema({
    studentName: {
        type: String,
        required: true
    },
    class: {
        type: String,
        required: true
    },
    parentName: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    }
}, { timestamps: true });

module.exports = mongoose.model('Admission', admissionSchema);
