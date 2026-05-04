const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI).then(() => console.log('Admin Server: MongoDB connected'));

app.use('/api', require('./routes/admin_api'));

app.listen(3001, () => console.log('Admin Process running on port 3001'));