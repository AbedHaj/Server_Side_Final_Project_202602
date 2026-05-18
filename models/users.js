const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    first_name: { //change this
        type: String,
        required: true
    },
    last_name: { //change this
        type: String,
        required: true
    },
    birthday: {
        type: Date,
        required: true
    },
    total: {
        type: Number,
        default: 0 }
});

module.exports = mongoose.model('users', usersSchema);