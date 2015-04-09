var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var accessKeyId =  process.env.AWS_ACCESS_KEY || "AKIAIMLEGGCG5WIBWTOQ";
var secretAccessKey = process.env.AWS_SECRET_KEY || "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";

var VLOGS = mongoose.model('vehicle_logs');

var sendResponse = function(req,res,next) {
	if(req.err) 
		res.send({msg: false, err: req.err});
	else {
		res.send({msg: true, data: req.entry});
	}
};

router.post('/vlogs', [function(req,res, next) {
	console.log(JSON.stringify(req.body));
	var reqEntry = req.body;
	reqEntry._id = new mongoose.Types.ObjectId;
  	reqEntry.vehicle_id = mongoose.Types.ObjectId(reqEntry.vehicle_id);
  	reqEntry.user_id = mongoose.Types.ObjectId(reqEntry.user_id);
  	reqEntry.station_id = mongoose.Types.ObjectId(reqEntry.station_id);
  	reqEntry.date_modified = dateToUnixEpoch(new Date(reqEntry._id.getTimestamp()));
	
	var newEntry = new VLOGS(reqEntry);
	console.log(JSON.stringify(newEntry));
	newEntry.save(function(err, entry, numbersAffected){
		req.err = err;
		req.entry = entry;
		next();
	});
}, sendResponse]);

router.get('/vlogs', [function(req,res, next) {
	console.log(JSON.stringify(req.body));
	var reqEntry = req.body;
	reqEntry._id = new mongoose.Types.ObjectId;
  	reqEntry.vehicle_id = mongoose.Types.ObjectId(reqEntry.vehicle_id);
  	reqEntry.user_id = mongoose.Types.ObjectId(reqEntry.user_id);
  	reqEntry.station_id = mongoose.Types.ObjectId(reqEntry.station_id);
  	reqEntry.date_modified = dateToUnixEpoch(new Date(reqEntry._id.getTimestamp()));
	
	var newEntry = new VLOGS(reqEntry);
	console.log(JSON.stringify(newEntry));
	newEntry.save(function(err, entry, numbersAffected){
		req.err = err;
		req.entry = entry;
		next();
	});
}, sendResponse]);

router.post('/upload', function(req, res){

});

module.exports = router;