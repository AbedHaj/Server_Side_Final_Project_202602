const express = require('express');
const router = express.Router();

const teamMembers = [
    { first_name: 'Abed el hafeeth', lastName: 'Haj Yahia' },
    { first_name: 'Lior', lastName: 'Mizrachi' }
];

// GET /api/about 3004
router.get('/about', (req, res, next) => {
    req.log.info({ action: 'GET /api/about' }, 'About endpoint accessed'); // Log the about endpoint
    try {
        res.status(200).json(teamMembers);
    } catch (error) {
        next(error);
    }
});

module.exports = router;