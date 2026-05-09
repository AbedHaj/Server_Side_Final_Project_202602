const pino = require('pino');

const transport = pino.transport({
    target: 'pino-mongodb',
    options: {
        // Make sure this matches your MongoDB Atlas connection string
        uri: process.env.MONGODB_URI,
        // This satisfies the requirement for a "logs" collection
        collection: 'logs',
        immediate: true
    }
});

const logger = pino(transport);

module.exports = logger;