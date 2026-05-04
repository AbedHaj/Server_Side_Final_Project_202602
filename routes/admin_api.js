const express = require('express');
const router = express.Router();
const logs = require('../models/logs');

// GET /api/logs
router.get('/logs', async (req, res) => {
    try {
        const allLogs = await logs.find({});
        res.status(200).json(allLogs);
    } catch (error) {
        res.status(500).json({ id: 500, message: "Failed to retrieve logs: " + error.message });
    }
});

module.exports = router;