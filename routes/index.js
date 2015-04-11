var express = require('express');
var passport = require('passport');
var Admin = require('../models/admin');
var router = express.Router();
var mongoose = require('mongoose');

var USERS = mongoose.model('users');
var VEHICLES = mongoose.model('vehicles');

/* GET home page. */
router.get('/', function(req, res) {
	if(req.session.passport.user !== undefined) {
		res.render('index', { title: 'Express' });
	}
	else {
		res.redirect('/signin');
	}
 
});



/* Signin Page */
router.get('/signin', function(req, res) {
  res.render('signin');
});

router.get('/:name', function(req,res){
	var name = req.params.name;
	if(name === 'logout') {
		req.logout();
    	res.redirect('/signin');
	}
	else if(req.session.passport.user !== undefined && name !== 'signin') {
		res.render(name);
	}
	else {
		res.redirect('/signin');
	}

});

/*START ADMIN PAGE and API*/
router.get('/register', function(req, res) {
    res.render('register', { });
});

router.post('/register', function(req, res) {
    Admin.register(new Admin({ username : req.body.username }), req.body.password, function(err, account) {
        if (err) {
            return res.render('register', { account : account });
        }

        passport.authenticate('local')(req, res, function () {
        	res.render('register', {user: req.session.passport.user});
            //res.redirect('/admin');
        });
    });
});

router.get('/login', function(req, res) {
    res.redirect('/signin');
});

router.post('/login', passport.authenticate('local'), function(req, res) {
    res.redirect('/');
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/ping', function(req, res){
    res.status(200).send("pong!");
});
/*END ADMIN PAGE and API*/

var getUserVehicles = function(req,res,next) {
	if(req.entry) {
		console.log("get vehicles");
		VEHICLES.find({user_id: req.entry._id}, function(err, doc){
			console.log(JSON.stringify(doc));
			req.err = err;
			console.log("VEHICLES: "+doc);
			req.vehicles = doc;
			console.log(JSON.stringify(req.entry));
				next();
		});
	}
	else{
		next();
	}

}

var isUserExist = function(req,res,next) {
    var user = req.body.auth;
    console.log(JSON.stringify(req.body));
    if(!Object.prototype.hasOwnProperty.call(user,'type')) {
    	user.password = toMD5(user.password);
		USERS.findOne({"auth.username": user.username, "auth.password": user.password}, function(err, doc){
			console.log(doc);
			if(doc === null) {
				res.send({msg: false, err: "Invalid username or password."})
			}
			req.err = err;
			req.entry = doc;
			req.addUser = false;

			next();
		});
	}
	else {
		USERS.findOne(
			{
				"auth.type.social_id": user.type.social_id,
				"auth.type.social": user.type.social
			}, function(err, doc){
			req.err = err;
			req.entry = doc;
			console.log("social login");
			if(req.body.info && isEmptyObject(doc)<=0) {	
				req.addUser = true;
            }
            else {
            	req.addUser = false;
            }

			next();
		});	
	}
};

function isEmptyObject(obj) {
  console.log("length="+Object.keys(obj).length);
  console.log(JSON.stringify(obj));
  return Object.keys(obj).length;
}

var addUser = function(req,res,next) {
	console.log("ADD USER");
	console.log(JSON.stringify(req.entry));
    if(req.addUser) {
    	console.log("addUser");
		console.log(JSON.stringify(req.body));
		var reqEntry = req.body;
		reqEntry._id = new mongoose.Types.ObjectId;
		reqEntry.date_modified = dateToUnixEpoch(new Date(reqEntry._id.getTimestamp()));
		if(!reqEntry.auth.type) {
			reqEntry.auth.password = toMD5(reqEntry.auth.password);		
		}

		reqEntry.vehicles = [];

		var newEntry = new USERS(reqEntry);

		
		newEntry.save(function(err, entry, numbersAffected){
			req.err = err;
			req.entry = entry;
			next();
		});
     	next();
    }
    else {
    	if(req.err) {
    		res.send({msg: false, data: req.err});
    	}
    	else {
    		console.log("SEND: "+req.vehicles);
    		req.entry.vehicles = req.vehicles;
    		res.send({msg: true, data: req.entry});
    	}
    }

};

var sendResponse = function(req,res,next) {
	console.log("SENDRESPONSE");
	if(req.err) 
		res.send({msg: false, err: req.err});
	else {
		console.log("SENDRESPONSE: "+req.vehicles);
		req.entry.vehicles = req.vehicles;
		res.send({msg: true, data: req.entry});
	}
};

router.post('/auth', [isUserExist, getUserVehicles, addUser, sendResponse]);

//utils
toMD5 = function(password) {
	return crypto.createHash('md5').update(JSON.stringify(password)).digest("hex");
}
module.exports = router;
