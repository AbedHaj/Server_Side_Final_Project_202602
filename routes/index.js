var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  req.log.info('Fetching home page');
  try {
    res.render('index', { title: 'Express' });
  } catch (error) {
    req.log.error({ error: error.message }, 'Failed to render home page');
    next(error);
  }
});

module.exports = router;