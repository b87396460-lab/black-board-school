const mongoose = require('mongoose');

const parentSchema = new mongoose.Schema({
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
    childId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Parent', parentSchema);
