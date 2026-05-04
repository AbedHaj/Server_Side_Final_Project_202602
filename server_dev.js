const express = require('express');
const app = express(); // Devs don't need DB connection for just a static array!

app.use(express.json());
app.use('/api', require('./routes/dev_api'));

app.listen(3004, () => console.log('Dev Process running on port 3004'));