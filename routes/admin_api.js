const express = require('express');
const router = express.Router();
const logs = require('../models/logs');

// GET /api/logs 3001
router.get('/logs', async (req, res) => {
    req.log.info('Fetching all logs from the database');
    try {
        const allLogs = await logs.find({});
        res.status(200).json(allLogs);
    } catch (error) {
        req.log.error({ error: error.message }, 'Failed to retrieve logs');
        res.status(500).json({ id: 500, message: "Failed to retrieve logs: " + error.message });
    }
});

module.exports = router;