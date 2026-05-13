const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const pinoHttp = require('pino-http');
const logger = require('./logger');
const app = express();
app.use(pinoHttp({ logger }));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI).then(() => console.log('Costs Server: MongoDB connected'));

app.use('/api', require('./routes/costs_api'));

app.use((req, res, next) => {
    res.status(404).json({   //404 (Route Not Found) ,this catches it and forces the JSON format.
        id: 404,
        message: "Endpoint not found"
    });
});

app.use((err, req, res, next) => {
    const statusCode = err.status || 500;  //global error handler, if route throws error, it endsu p here

    res.status(statusCode).json({  //forced id message requirement
        id: statusCode,
        message: err.message || "Internal Server Error"
    });
});

app.listen(3003, () => console.log('Costs Process running on port 3003'));