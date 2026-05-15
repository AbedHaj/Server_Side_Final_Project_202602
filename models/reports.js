const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    userid: { type: Number, required: true },
    year: { type: Number, required: true },
    month: { type: Number, required: true },
    costs: {
        food: { type: Array, default: [] },
        education: { type: Array, default: [] },
        health: { type: Array, default: [] },
        housing: { type: Array, default: [] },
        sports: { type: Array, default: [] }
    }
});

module.exports = mongoose.model('reports', reportSchema);