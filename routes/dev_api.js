const express = require('express');
const router = express.Router();

const teamMembers = [
    { first_name: "Abed el hafeeth", last_name: "Haj Yahia" },
    { first_name: "Lior", last_name: "Mizrahi" }
];

// GET /api/about 3004
router.get('/about', (req, res) => {
    req.log.info('Fetching team about details');
    try {
        res.status(200).json(teamMembers);
    } catch (error) {
        req.log.error({ error: error.message }, 'Failed to retrieve team details');
        res.status(500).json({ id: 500, message: error.message });
    }
});

module.exports = router;