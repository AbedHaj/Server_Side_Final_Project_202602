const express = require('express');
const router = express.Router();
const logs = require('../models/logs');

// GET /api/logs 3001
router.get('/logs', async (req, res, next) => {
    req.log.info({ action: "GET /api/logs" }, 'Logs endpoint accessed');
    try {
        const allLogs = await logs.find({});
        res.status(200).json(allLogs);
    } catch (error) {
        next(error);
    }
});

module.exports = router;