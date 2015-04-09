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



router.post('/session', function(req,res,next) {

	if(req.session.passport.user)
		res.send({user: req.session.passport.user});
	else
		res.send({});

});

var addUser = function(req,res,next) {

	console.log(JSON.stringify(req.body));
	var reqEntry = req.body;
	reqEntry._id = new mongoose.Types.ObjectId;
	reqEntry.date_modified = dateToUnixEpoch(new Date(reqEntry._id.getTimestamp()));
	reqEntry.auth.password = toMD5(reqEntry.auth.password);
	reqEntry.vehicles = [];
	if(reqEntry.info.dp===undefined) {
		reqEntry.info.dp = getDefaultDP(reqEntry.info.gender);
	}
	else if (reqEntry.info.dp == "") {
		reqEntry.info.dp = getDefaultDP(reqEntry.info.gender);
	}

	console.log(JSON.stringify(reqEntry));

	var newEntry = new USERS(reqEntry);

	
	newEntry.save(function(err, entry, numbersAffected){
		req.err = err;
		req.entry = entry;
		next();
	});
};


function getDefaultDP(gender){
	console.log("Add DP");
	if(gender == "Male" || gender == "male") {
		return "https://s3-ap-southeast-1.amazonaws.com/gasgaspinas/unknown-male.jpg";
	}
	else if(gender == "Female" || gender == "female") {
		return "https://s3-ap-southeast-1.amazonaws.com/gasgaspinas/unknown-female.jpg";
	} 
}
var existingUser = function(req,res,next) {
	console.log("existingUser()");
	USERS.findOne({"auth.username": req.body.auth.username}, function(err, doc){
		if(err) {
			res.send({msg: false, err: req.err});
		}
		else if(doc) {
			res.send({msg: false, err: "Username alerady exist!"});
		}
		else {
			next();
		}		
	});

}

var sendResponse = function(req,res,next) {
	if(req.err) 
		res.send({msg: false, err: req.err});
	else {
		res.send({msg: true, data: req.entry});
	}
};

router.post('/users', [existingUser, addUser, sendResponse]);

router.put('/users/:id', [function(req,res,next){
	console.log(req.body);
	USERS.update({_id: new mongoose.Types.ObjectId(req.params.id)}, {$set: req.body},
		function(err, numbersAffected, raw){
			if(raw.updatedExisting == false) {
				req.err = raw;
			}
			else {
				req.err = err;
				req.entry = raw;
			}
			next();
		});
},sendResponse]);

router.delete('/users/:id', [function(req, res, next) {
	console.log("DELETE: "+req.params.id);
	USERS.remove({_id: new mongoose.Types.ObjectId																																																																																																																																																																																																																																																																																																					(req.params.id)}, 
		function(err) {
			req.err = err;
			req.entry = null;
			next();
		}
	);
},sendResponse]);

module.exports = router;