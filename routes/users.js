var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  req.log.info('Fetching users listing');
  try {
    res.send('respond with a resource');
  } catch (error) {
    req.log.error({ error: error.message }, 'Failed to fetch users listing');
    next(error);
  }
});

module.exports = router;