const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    userid: { type: Number, required: true },
    year: { type: Number, required: true },
    month: { type: Number, required: true },
    // This will store the formatted array of category objects exactly as requested
    costs: { type: Array, required: true }
});

module.exports = mongoose.model('reports', reportSchema);