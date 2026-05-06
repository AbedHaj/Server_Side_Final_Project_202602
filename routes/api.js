const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const costs = require('../models/costs');
const logs = require('../models/logs');
const users = require('../models/users');
const reports = require('../models/reports');

router.post('/add', async (req, res) => {
    req.log.info({ body: req.body }, 'Attempting to add a new cost');

    try {
        const { description, category, userid, sum } = req.body; // Remove 'date'

        const newCost = new costs({
            description,
            category,
            userid: Number(userid),
            sum: Number(sum)
            // No date property here!
        });

        const savedCost = await newCost.save();

        // Log it
        await new logs({ action: 'POST /api/add', details: savedCost }).save();

        req.log.info({ costId: savedCost._id }, 'Successfully added new cost');
        res.status(201).json(savedCost);
    } catch (error) {
        req.log.error({ error: error.message }, 'Failed to add new cost');
        res.status(400).json({ error: error.message });
    }
});

// GET http://localhost:3000/api/about
const teamMembers = [
    { first_name: "Abed el hafeeth", last_name: "Haj Yahia" },
    { first_name: "Lior", last_name: "Mizrahi" }
];
router.get('/about', (req, res) => {
    req.log.info('Fetching team about details');
    try {
        res.status(200).json(teamMembers);
    } catch (error) {
        req.log.error({ error: error.message }, 'Failed to retrieve team details');
        res.status(500).json({
            error: "Failed to retrieve team details",
            details: error.message
        });
    }
});

// GET http://localhost:3000/api/users
router.get('/users', async (req, res) => {
    req.log.info('Fetching all users');
    try {
        // Fetch all documents from the 'users' collection
        const allUsers = await users.find({});

        // Return the JSON document describing all users
        res.status(200).json(allUsers);

    } catch (error) {
        // If an error happens, return a JSON document describing the error
        req.log.error({ error: error.message }, 'Failed to retrieve users list');
        res.status(500).json({
            error: "Failed to retrieve users list",
            details: error.message
        });
    }
});

//http://localhost:3000/api/users/:id
router.get('/users/:id', async (req, res) => {
    req.log.info({ userId: req.params.id }, 'Fetching specific user details and total costs');
    try {
        // 1. Get the ID from the URL (e.g., 123123)
        const userIdParam = parseInt(req.params.id);

        // 2. Find the user details
        const userData = await users.findOne({ id: userIdParam });

        if (!userData) {
            req.log.warn({ userId: userIdParam }, 'User not found');
            return res.status(404).json({ error: "User not found" });
        }

        // 3. Calculate the total costs for this specific user
        // We use an aggregation to sum up the 'sum' field for all documents with this userid
        const totalCosts = await costs.aggregate([
            { $match: { userid: userIdParam } },
            { $group: { _id: null, totalSum: { $sum: "$sum" } } }
        ]);

        // If the user has no costs yet, totalSum will be 0
        const totalAmount = totalCosts.length > 0 ? totalCosts[0].totalSum : 0;

        // 4. Return the specific JSON format requested
        res.status(200).json({
            first_name: userData.first_name,
            last_name: userData.last_name,
            id: userData.id,
            total: totalAmount
        });

    } catch (error) {
        // If an error happens, return a JSON document describing the error
        req.log.error({ error: error.message }, 'Failed to retrieve user details');
        res.status(500).json({
            error: "Failed to retrieve user details",
            details: error.message
        });
    }
});


// http://localhost:3000/api/logs
router.get('/logs', async (req, res) => {
    req.log.info('Fetching all logs from the database');
    try {
        // Fetch all documents from the 'logs' collection
        const allLogs = await logs.find({});

        // Return the JSON document describing all logs
        res.status(200).json(allLogs);

    } catch (error) {
        // Return JSON document describing the error
        req.log.error({ error: error.message }, 'Failed to retrieve logs');
        res.status(500).json({
            error: "Failed to retrieve logs",
            details: error.message
        });
    }
});

// ==========================================
// GET http://localhost:3000/api/report?id=123123&year=2025&month=11
// ==========================================
router.get('/report', async (req, res) => {
    req.log.info({ query: req.query }, 'Generating report requested');
    try {
        const userid = parseInt(req.query.id);
        const year = parseInt(req.query.year);
        const month = parseInt(req.query.month);

        if (!userid || !year || !month) {
            req.log.warn('Missing parameters for report generation');
            return res.status(400).json({ error: "Missing parameters" });
        }

        // Computed Design Pattern: Check if it's a past month
        const currentDate = new Date();
        const isPastMonth = (year < currentDate.getFullYear()) ||
            (year === currentDate.getFullYear() && month < (currentDate.getMonth() + 1));

        if (isPastMonth) {
            const savedReport = await reports.findOne({ userid, year, month });
            if (savedReport) {
                req.log.info('Returned cached report for past month');
                return res.status(200).json(savedReport);
            }
        }

        // --- THE "NO DATE FIELD" TRICK ---
        // Create timestamps for the start and end of the month
        const startTimestamp = Math.floor(new Date(Date.UTC(year, month - 1, 1)).getTime() / 1000);
        const endTimestamp = Math.floor(new Date(Date.UTC(year, month, 1)).getTime() / 1000);

        // Convert those timestamps into MongoDB ObjectIds
        const startId = mongoose.Types.ObjectId.createFromTime(startTimestamp);
        const endId = mongoose.Types.ObjectId.createFromTime(endTimestamp);

        // Search using _id range instead of a date field
        const fetchedCosts = await costs.find({
            userid: userid,
            _id: { $gte: startId, $lt: endId }
        });
        // ---------------------------------

        const categories = ['food', 'education', 'health', 'housing', 'sports'];
        const groupedCosts = categories.map(cat => ({ [cat]: [] }));

        fetchedCosts.forEach(cost => {
            const categoryObj = groupedCosts.find(c => c[cost.category] !== undefined);
            if (categoryObj) {
                // Extract the day from the _id since we don't have a date field
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
            req.log.info('Saved new report for past month to cache');
        }

        req.log.info('Successfully generated and returned report');
        res.status(200).json(generatedReport);

    } catch (error) {
        req.log.error({ error: error.message }, 'Report generation error');
        res.status(500).json({ error: "Report error", details: error.message });
    }
});

module.exports = router;