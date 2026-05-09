const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const costs = require('../models/costs');
const logs = require('../models/logs');
const reports = require('../models/reports');

// POST /api/add (Add Cost) 3003
router.post('/add', async (req, res) => {
    try {
        const { description, category, userid, sum } = req.body;
        const newCost = new costs({ description, category, userid: Number(userid), sum: Number(sum) });
        const savedCost = await newCost.save();

        await new logs({ action: 'POST /api/add', details: savedCost }).save();

        res.status(201).json(savedCost);
    } catch (error) {
        res.status(400).json({ id: 400, message: error.message });
    }
});

// GET /api/report
router.get('/report', async (req, res) => {
    try {
        const userid = parseInt(req.query.id);
        const year = parseInt(req.query.year);
        const month = parseInt(req.query.month);

        if (!userid || !year || !month) {
            return res.status(400).json({ id: 400, message: "Missing parameters" });
        }

        const currentDate = new Date();
        const isPastMonth = (year < currentDate.getFullYear()) || (year === currentDate.getFullYear() && month < (currentDate.getMonth() + 1));

        if (isPastMonth) {
            const savedReport = await reports.findOne({ userid, year, month });
            if (savedReport) return res.status(200).json(savedReport);
        }

        const startTimestamp = Math.floor(new Date(Date.UTC(year, month - 1, 1)).getTime() / 1000);
        const endTimestamp = Math.floor(new Date(Date.UTC(year, month, 1)).getTime() / 1000);
        const startId = mongoose.Types.ObjectId.createFromTime(startTimestamp);
        const endId = mongoose.Types.ObjectId.createFromTime(endTimestamp);

        const fetchedCosts = await costs.find({
            userid: userid,
            _id: { $gte: startId, $lt: endId }
        });

        const categories = ['food', 'education', 'health', 'housing', 'sports'];
        const groupedCosts = categories.map(cat => ({ [cat]: [] }));

        fetchedCosts.forEach(cost => {
            const categoryObj = groupedCosts.find(c => c[cost.category] !== undefined);
            if (categoryObj) {
                const dateFromId = cost._id.getTimestamp();
                categoryObj[cost.category].push({
                    sum: cost.sum,
                    description: cost.description,
                    day: dateFromId.getUTCDate()
                });
            }
        });

        const generatedReport = { userid, year, month, costs: groupedCosts };

        if (isPastMonth) {
            await new reports(generatedReport).save();
        }

        res.status(200).json(generatedReport);

    } catch (error) {
        res.status(500).json({ id: 500, message: "Report error: " + error.message });
    }
});

module.exports = router;