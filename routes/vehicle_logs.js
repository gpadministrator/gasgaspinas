var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');



var VLOGS = mongoose.model('vehicle_logs');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('vlogs', { title: 	"Feeds" });
});

/*
router.get('/generate', function(req, res) {

    res.render('vlogs', { title: JSON.stringify(generateFeeds()) });
});
*/

router.post('/', function(req,res) {
	console.log(JSON.stringify(req.body));
	var reqEntry = req.body;
	reqEntry._id = new mongoose.Types.ObjectId;
  reqEntry.vehicle_id = mongoose.Types.ObjectId(reqEntry.vehicle_id);
  reqEntry.user_id = mongoose.Types.ObjectId(reqEntry.user_id);
  reqEntry.station_id = mongoose.Types.ObjectId(reqEntry.station_id);
  reqEntry.date_modified = dateToUnixEpoch(new Date(reqEntry._id.getTimestamp()));
	var newEntry = new VLOGS(reqEntry);
	console.log(JSON.stringify(newEntry));
	newEntry.save(function(error, entry, numbersAffected){
		if(error) 
			res.send({msg: false, err: error});
		else {
			res.send({msg: true, data: entry, rowsAffected: numbersAffected});
		}
	});
});

router.get('/:id', function(req,res){
  var options = [
    {
      $match: {user_id: new mongoose.Types.ObjectId(req.params.id) }
    },
    {
      $group:
      {
        _id: {vehicle_id: "$vehicle_id"},
        logs:
        {
          $push:
          {
            station_id: "$station_id",
            fuel_consumed: "$fuel_consumed",
            distance_traveled: "$distance_traveled",
            liters: "$liters",
            amount: "$amount",
            fuel_savings: "$fuel_savings",
            fuel_consumed: "$fuel_consumed",
            _id: "$_id",
            date_modified: "$date_modified",
          }
        }
      }
    }
  ];

  VLOGS.aggregate(options,

  	function(error, doc){
  		if(error) {
  			res.send({msg: false, err: error});
  		}
  		else {
  			res.send({msg: true, data: doc});
  		}
  	}
  )
});

/*
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
  			res.send({msg: false, data: err});
  		}
  		else {
  			res.send({msg: true, data: doc});
  		}	
  	}
  )

});
*/

router.put('/:id', function(req, res){
	console.log(req.body);
	VLOGS.update({_id: new mongoose.Types.ObjectId(req.params.id)}, {$set: req.body},
		function(error, numbersAffected, raw){
			if(error) {
				res.send({msg: false, err: error});
			}
			else {
				res.send({msg: true, data: raw, rowsAffected: numbersAffected});
			}
		});
});

router.delete('/:id', function(req, res) {
	VLOGS.remove({_id: new mongoose.Types.ObjectId(req.params.id)}, 
		function(error) {
			if(error) {
				res.send({msg: false, err: error});
			}
			else {
				res.send({msg: true, data: null});
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
