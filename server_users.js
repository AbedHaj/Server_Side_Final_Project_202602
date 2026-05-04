const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI).then(() => console.log('Users Server: MongoDB connected'));

app.use('/api', require('./routes/users_api'));

app.listen(3002, () => console.log('Users Process running on port 3002'));