const mongoose = require('mongoose');

const logsSchema = new mongoose.Schema({
    action: {
        type: String, // e.g., "POST /api/add"
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now // Automatically logs the current date/time
    },
    details: {
        type: Object // Can store the request body or error details
    }
});

module.exports = mongoose.model('logs', logsSchema);