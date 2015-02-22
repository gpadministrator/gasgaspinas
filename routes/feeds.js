var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');



var FEEDS = mongoose.model('feeds');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('feeds', { title: 	HOME });
});

router.get('/generate', function(req, res) {

    res.render('feeds', { title: JSON.stringify(generateFeeds()) });
});


router.post('/', function(req,res) {
	console.log(JSON.stringify(req.body));
	var reqEntry = req.body;
	reqEntry._id = new mongoose.Types.ObjectId;
	var newEntry = new FEEDS(reqEntry);
	console.log(JSON.stringify(newEntry));
	newEntry.save(function(err, entry, numbersAffected){
		if(err) 
			res.send({msg: "NG", data: err});
		else {
			res.send({msg: "OK", data: entry, rowsAffected: numbersAffected});
		}
	});
});

router.get('/:id', function(req,res){

  FEEDS.find({_id: new mongoose.Types.ObjectId(req.params.id)},

  	function(err, doc){
  		if(err) {
  			res.send({msg: "NG", data: err});
  		}
  		else {
  			res.send({msg: "OK", data: doc});
  		}
  	}
  )
});

router.get('/type/:type', function(req,res){

  var options = {};
  if(req.params.type != "all") {
  		options['feed_type'] = req.params.type;
  }

  console.log("date "+req.query.date);
  if(req.query.date != undefined) {
  		options._id = {$gt: objectIdWithTimestamp(req.query.date)}
  }


  var query = FEEDS.find(options);
  var limit = 0;
  if(req.query.limit != undefined)
  {
      limit = req.query.limit;
  }
 
  console.log("limit "+limit);

  var skip = 0;
  if(req.query.page != undefined && limit != 0) {
      skip  = limit * req.query.page 
  }
  console.log("skip" + skip);

  query.limit(limit).skip(skip);
  query.exec(
  	function(err, doc){
  		if(err) {
  			res.send({msg: "NG", data: err});
  		}
  		else {
  			res.send({msg: "OK", data: doc});
  		}	
  	}
  )

});

router.put('/:id', function(req, res){
	console.log(req.body);
	FEEDS.update({_id: new mongoose.Types.ObjectId(req.params.id)}, {$set: req.body},
		function(err, numbersAffected, raw){
			if(err) {
				res.send({msg: "NG", data: err});
			}
			else {
				res.send({msg: "OK", data: raw, rowsAffected: numbersAffected});
			}
		});
});

router.delete('/:id', function(req, res) {
	FEEDS.remove({_id: new mongoose.Types.ObjectId(req.params.id)}, 
		function(err) {
			if(err) {
				res.send({msg: "NG", data: err});
			}
			else {
				res.send({msg: "OK", data: null});
			}
		}
	);
});

function objectIdWithTimestamp(timestamp) {
    // Convert string date to Date object (otherwise assume timestamp is a date)
    if (typeof(timestamp) == 'string') {
        timestamp = new Date(timestamp);
    }

    // Convert date object to hex seconds since Unix epoch
    var hexSeconds = Math.floor(timestamp/1000).toString(16);

    // Create an ObjectId with that hex timestamp
    return mongoose.Types.ObjectId(hexSeconds + "0000000000000000");
}

module.exports = router;
