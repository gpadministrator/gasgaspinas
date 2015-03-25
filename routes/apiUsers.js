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

router.get('/users', [function(req, res, next){
	USERS.find(function(err, doc){
		req.err = err;
		req.entry = doc;
		next();
	});
}, sendResponse]);

router.get('/users/:id', [function(req, res, next){
	var id = req.params.id;

	USERS.find({_id: new mongoose.Types.ObjectId(id)}, function(err, doc){
		req.err = err;
		req.entry = doc;
		next();
	});
}, sendResponse]);

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



module.exports = router;