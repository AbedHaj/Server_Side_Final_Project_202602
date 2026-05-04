const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI).then(() => console.log('Costs Server: MongoDB connected'));

app.use('/api', require('./routes/costs_api'));

app.listen(3003, () => console.log('Costs Process running on port 3003'));