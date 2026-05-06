const LogEntry = require('./models/logs');
class MongoLogStream {
    write(chunk) {
        const line = String(chunk).trim();
        if (!line) return true;
        try {
            const obj = JSON.parse(line);
            LogEntry.create(obj).catch((err) => {
                process.stderr.write(`Failure: ${err.message}\n`);
            });
        } catch {
            LogEntry.create({ msg: line }).catch((err) => {
                process.stderr.write(`Failure: ${err.message}\n`);
            });
        }
        return true;
    }
}
module.exports = MongoLogStream;