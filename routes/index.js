var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var USERS = mongoose.model('users');
/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});



var isUserExist = function(req,res,next) {
    var user = req.body.auth;
    user.password = toMD5(user.password);
    console.log(JSON.stringify(user));
    if(user.type) {
		USERS.find({"auth.username": user.username, "auth.password": user.password}, function(err, doc){
			req.err = err;
			req.entry = doc;
			req.addUser = false;
			next();
		});
	}
	else {
		USERS.find(
			{
				"auth.type.social_id": user.type.social_id,
				"auth.type.social": user.type.social
			}, function(err, doc){
			req.err = err;
			req.entry = doc;

			if(req.body.info != undefined) {
				req.addUser = true;
            }
            else {
            	req.addUser = false;
            }

			next();
		});	
	}
};

var addUser = function(req,res,next) {


    if(!req.addUser) {
     	next();
    }

	console.log(JSON.stringify(req.body));
	var reqEntry = req.body;
	reqEntry._id = new mongoose.Types.ObjectId;
	reqEntry.date_modified = dateToUnixEpoch(new Date(reqEntry._id.getTimestamp()));
	reqEntry.auth.password = toMD5(reqEntry.auth.password);
	reqEntry.vehicles = [];


	var newEntry = new USERS(reqEntry);

	
	newEntry.save(function(err, entry, numbersAffected){
		req.err = err;
		req.entry = entry;
		next();
	});
};

var sendResponse = function(req,res,next) {
	if(req.err) 
		res.send({msg: false, data: req.err});
	else {
		res.send({msg: true, data: req.entry});
	}
};

router.post('/auth', [isUserExist, addUser, sendResponse]);

//utils
toMD5 = function(password) {
	return crypto.createHash('md5').update(JSON.stringify(password)).digest("hex");
}
module.exports = router;
