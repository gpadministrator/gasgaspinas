var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
  res.render('users', { title: 'respond with a resource' })
  //res.send('respond with a resource');
});


router.get('/helloworld', function(req, res) {
  res.render('users', { title: 'respond with a resource' })
  //res.send('respond with a resource');
});

module.exports = router;
