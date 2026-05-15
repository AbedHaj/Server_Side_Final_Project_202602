const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const costs = require('../models/costs');
const logs = require('../models/logs');
const reports = require('../models/reports');
const users = require('../models/users');

// POST /api/add (Add Cost) 3003
router.post('/add', async (req, res, next) => {
    req.log.info({ action: "POST /api/add" }, 'Add Cost endpoint accessed');
    try {
        const { description, category, userid, sum } = req.body;
        const numUserId = Number(userid);
        const numSum = Number(sum);

        // 1. Save the actual cost
        const newCost = new costs({ description, category, userid: numUserId, sum: numSum });
        const savedCost = await newCost.save();

        // 2. COMPUTED PATTERN A: Update User's Total instantly
        await users.findOneAndUpdate(
            { id: numUserId },
            { $inc: { total: numSum } }
        );

        // 3. COMPUTED PATTERN B: Update Monthly Report instantly
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // getMonth is 0-indexed
        const day = date.getDate();

        await reports.findOneAndUpdate(
            { userid: numUserId, year: year, month: month },
            {
                // Push the cost right into the matching category array
                $push: { [`costs.${category}`]: { sum: numSum, description, day } }
            },
            { upsert: true, setDefaultsOnInsert: true } // Create report if it doesn't exist
        );

        res.status(201).json(savedCost);
    } catch (error) {
        error.status = 400;
        next(error);
    }
});

// GET /api/report
router.get('/report', async (req, res, next) => {
    const userid = parseInt(req.query.id);
    const year = parseInt(req.query.year);
    const month = parseInt(req.query.month);

    req.log.info({ action: "GET /api/report", params: { userid, year, month } }, 'Report endpoint accessed');

    try {
        if (!userid || !year || !month) {
            const err = new Error("Missing parameters");
            err.status = 400;
            return next(err);
        }

        // Fetch the pre-computed report! No filtering dates or sorting arrays.
        const savedReport = await reports.findOne({ userid, year, month });

        if (savedReport) {
            // Format it into the specific array structure the tests expect
            return res.status(200).json({
                userid: savedReport.userid,
                year: savedReport.year,
                month: savedReport.month,
                costs: [
                    { food: savedReport.costs.food },
                    { education: savedReport.costs.education },
                    { health: savedReport.costs.health },
                    { housing: savedReport.costs.housing },
                    { sports: savedReport.costs.sports }
                ]
            });
        }

        // If no costs were added this month, return an empty template
        res.status(200).json({
            userid, year, month,
            costs: [
                { food: [] }, { education: [] }, { health: [] }, { housing: [] }, { sports: [] }
            ]
        });

    } catch (error) {
        next(error);
    }
});

module.exports = router;