const mongoose = require('mongoose');
const LogSchema = new mongoose.Schema(
    {},
    { strict: false, minimize: false, timestamps: true, collection: 'logs' }
);
LogSchema.index({ time: 1 });
module.exports = mongoose.model('Log', LogSchema);
