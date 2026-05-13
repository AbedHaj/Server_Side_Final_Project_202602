const express = require('express');
const router = express.Router();

const teamMembers = [
    { first_name: "Abed el hafeeth", last_name: "Haj Yahia" },
    { first_name: "Lior", last_name: "Mizrahi" }
];

// GET /api/about 3004
router.get('/about', (req, res, next) => {
    req.log.info({ action: "GET /api/about" }, 'About endpoint accessed');
    try {
        res.status(200).json(teamMembers);
    } catch (error) {
        next(error);
    }
});

module.exports = router;