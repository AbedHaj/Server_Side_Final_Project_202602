const pino = require('pino');

const transport = pino.transport({
    target: 'pino-mongodb',
    options: {
        uri: process.env.MONGODB_URI,
        collection: 'logs',
        immediate: true
    }
});

const logger = pino(transport);

module.exports = logger;