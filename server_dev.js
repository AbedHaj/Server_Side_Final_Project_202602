const express = require('express');
require('dotenv').config();
const pinoHttp = require('pino-http');
const logger = require('./logger');
const app = express();
app.use(pinoHttp({ logger }));
app.use(express.json());
app.use('/api', require('./routes/dev_api'));

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

app.listen(3004, () => console.log('Dev Process running on port 3004'));