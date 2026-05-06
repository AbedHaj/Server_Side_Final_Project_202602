const express = require('express');
const router = express.Router();
const users = require('../models/users');
const costs = require('../models/costs');

// POST /api/add (Add User)
router.post('/add', async (req, res) => {
    req.log.info({ body: req.body }, 'Attempting to add a new user');
    try {
        const { id, first_name, last_name, birthday } = req.body;
        const newUser = new users({ id: Number(id), first_name, last_name, birthday: new Date(birthday) });
        const savedUser = await newUser.save();
        req.log.info({ userId: savedUser.id }, 'Successfully added new user');
        res.status(201).json(savedUser);
    } catch (error) {
        req.log.error({ error: error.message }, 'Failed to add new user');
        res.status(400).json({ id: 400, message: error.message });
    }
});

// GET /api/users
router.get('/users', async (req, res) => {
    req.log.info('Fetching all users');
    try {
        const allUsers = await users.find({});
        res.status(200).json(allUsers);
    } catch (error) {
        req.log.error({ error: error.message }, 'Failed to retrieve users list');
        res.status(500).json({ id: 500, message: error.message });
    }
});

// GET /api/users/:id
router.get('/users/:id', async (req, res) => {
    req.log.info({ userId: req.params.id }, 'Fetching specific user details and total costs');
    try {
        const userIdParam = parseInt(req.params.id);
        const userData = await users.findOne({ id: userIdParam });

        if (!userData) {
            req.log.warn({ userId: userIdParam }, 'User not found');
            return res.status(404).json({ id: 404, message: "User not found" });
        }

        const totalCosts = await costs.aggregate([
            { $match: { userid: userIdParam } },
            { $group: { _id: null, totalSum: { $sum: "$sum" } } }
        ]);

        const totalAmount = totalCosts.length > 0 ? totalCosts[0].totalSum : 0;

        res.status(200).json({
            first_name: userData.first_name,
            last_name: userData.last_name,
            id: userData.id,
            total: totalAmount
        });

    } catch (error) {
        req.log.error({ error: error.message }, 'Failed to retrieve user details');
        res.status(500).json({ id: 500, message: error.message });
    }
});

module.exports = router;