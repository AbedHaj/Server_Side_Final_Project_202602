const express = require('express');
const router = express.Router();
const users = require('../models/users');
const costs = require('../models/costs');

// POST /api/add (Add User) 3002
router.post('/add', async (req, res, next) => {
    req.log.info({ action: 'POST /api/add' }, 'Add User endpoint accessed');
    try {
        const { id, first_name, last_name, birthday } = req.body; //change this
        const newUser = new users({
            id: Number(id),
            first_name: first_name,
            last_name: last_name,
            birthday: new Date(birthday)
        });
        const savedUser = await newUser.save();
        res.status(201).json({
            id: savedUser.id,
            first_name: savedUser.first_name,
            last_name: savedUser.last_name,
            birthday: savedUser.birthday
        });
    } catch (error) {
        error.status = 400;
        next(error);
    }
});

// GET /api/users
router.get('/users', async (req, res, next) => {
    req.log.info({ action: 'GET /api/users' }, 'Get Users endpoint accessed');
    try {
        const allUsers = await users.find({});
        res.status(200).json(allUsers.map(user => ({
            id: user.id,
            firstName: user.first_name,
            lastName: user.last_name,
            birthday: user.birthday
        })));
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
            const err = new Error('User not found');
            err.status = 404;
            return next(err);
        }

        // fetch  the pre-computed total field for the purrchases.
        res.status(200).json({
            firstName: userData.first_name,
            lastName: userData.last_name,
            id: userData.id,
            total: userData.total || 0
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;