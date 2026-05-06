const createError = require('http-errors');
const express = require('express');
const mongoose =require('mongoose');
const pino = require('pino');
require('dotenv').config();
const path = require('path');
const pinoHttp = require('pino-http');
const cookieParser = require('cookie-parser');
const httpLogger = require('morgan');
const MongoLogStream = require('./mongoLogStream');

const logger = pino(
    {
        level: process.env.LOG_LEVEL || 'info',
        timestamp: pino.stdTimeFunctions.isoTime,
        base: { service: 'pino-express-mongo-logs' }
    },
    new MongoLogStream()
);

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const apiRouter = require('./routes/api');

const app = express();

app.use(pinoHttp({ logger }));

// connect to mongodb
const uri = process.env.MONGODB_URI;
mongoose.connect(uri)
    .then(() => {
        console.log("Successfully connected to MongoDB Atlas.");
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error);
    });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(httpLogger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);  //routes
app.use('/users', usersRouter);
app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;