var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/auth', function(req, res) {
    res.render('feeds', { title: 'Hello, World!' })
});


module.exports = router;
