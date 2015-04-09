var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var crypto = require('crypto');



var USERS = mongoose.model('users');
var VEHICLES = mongoose.model('vehicles');

var sendResponse = function(req,res,next) {
	if(req.err) 
		res.send({msg: false, err: req.err});
	else {
		res.send({msg: true, data: req.entry});
	}
};

router.get('/vehicles/:id', [function(req,res,next){

	var option = {};
	option.user_id = new mongoose.Types.ObjectId(req.params.id);

	console.log(JSON.stringify(option));
	VEHICLES.find(option, function(err, doc){
		req.err = err;
		req.entry = doc;
		next();
	});

},sendResponse]);


router.delete('/vehicles/:id', [function(req, res, next) {
	console.log("DELETE: "+req.params.id);
	VEHICLES.remove({_id: new mongoose.Types.ObjectId																																																																																																																																																																																																																																																																																																					(req.params.id)}, 
		function(err) {
			req.err = err;
			req.entry = null;
			next();
		}
	);
},sendResponse]);

router.post('/vehicles/:id', [function(req,res,next){ 

	var vehicleInfo = new VEHICLES(req.body);
	vehicleInfo._id = new mongoose.Types.ObjectId;
	vehicleInfo.user_id = new mongoose.Types.ObjectId(req.params.id);
	vehicleInfo.date_modified = Date.now ();

	vehicleInfo.save(function(err, entry, numbersAffected){
		req.err = err;
		req.entry = entry;
		next();
	});

},sendResponse]);

router.put('/vehicles/:id', [function(req,res,next){ 

	var vehicle = req.body
	var vehicle_id = req.params.id;
    if(vehicle.user_id) {
    	vehicle.user_id = new mongoose.Types.ObjectId(vehicle.user_id);
    }

    if(vehicle.station_id) {
    	vehicle.station_id = new mongoose.Types.ObjectId(vehicle.station_id);
    }

	console.log(vehicle);

	VEHICLES.update({_id: new mongoose.Types.ObjectId(vehicle_id)}, {$set: vehicle},
		function(err, numbersAffected, raw){
			req.err = err;
			req.entry = raw;
			next();
		});

},sendResponse]);
module.exports = router;