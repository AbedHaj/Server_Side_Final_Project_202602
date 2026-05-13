const express = require('express');
const router = express.Router();
const users = require('../models/users');
const costs = require('../models/costs');

// POST /api/add (Add User) 3002
router.post('/add', async (req, res, next) => {
    req.log.info({ action: "POST /api/add" }, 'Add User endpoint accessed');
    try {
        const { id, first_name, last_name, birthday } = req.body;
        const newUser = new users({ id: Number(id), first_name, last_name, birthday: new Date(birthday) });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        error.status = 400;
        next(error);
    }
});

// GET /api/users
router.get('/users', async (req, res, next) => {
    req.log.info({ action: "GET /api/users" }, 'Get Users endpoint accessed');
    try {
        const allUsers = await users.find({});
        res.status(200).json(allUsers);
    } catch (error) {
        next(error);
    }
});

// GET /api/users/:id
router.get('/users/:id', async (req, res, next) => {
    const userIdParam = parseInt(req.params.id);
    req.log.info({ action: `GET /api/users/${userIdParam}` }, 'User Profile endpoint accessed');
    try {
        const userData = await users.findOne({ id: userIdParam });

        if (!userData) {
            const err = new Error("User not found");
            err.status = 404;
            return next(err);
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
        next(error);
    }
});

module.exports = router;