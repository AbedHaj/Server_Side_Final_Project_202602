const express = require('express');
const router = express.Router();

const teamMembers = [
    { first_name: "Abed el hafeeth", last_name: "Haj Yahia" },
    { first_name: "Lior", last_name: "Mizrahi" }
];

// GET /api/about
router.get('/about', (req, res) => {
    try {
        res.status(200).json(teamMembers);
    } catch (error) {
        res.status(500).json({ id: 500, message: error.message });
    }
});

module.exports = router;