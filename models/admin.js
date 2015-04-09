var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var Admin = new Schema({
    	username: String,
    	password: String,
	},
	{ versionKey: false }
);

Admin.plugin(passportLocalMongoose);

module.exports = mongoose.model('admin', Admin, 'admin');