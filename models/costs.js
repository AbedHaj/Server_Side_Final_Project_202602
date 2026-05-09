const mongoose = require('mongoose');

const costsSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['food', 'health', 'housing', 'sports', 'education'] // Enforces allowed categories
    },
    userid: {
        type: Number,
        required: true
    },
    sum: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('costs', costsSchema);