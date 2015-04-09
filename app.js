var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongodb = require('mongodb').MongoClient;
var format = require('util').format;
var passport =require('passport');
var LocalStrategy = require('passport-local').Strategy;
var AWS = require('aws-sdk');
var fs = require('fs');
var multer = require('multer');

//Schema
require('./schema/schema.js');
var routes = require('./routes/index');
var users = require('./routes/users');
var apiUsers = require('./routes/apiUsers');
var apiUVehicles = require('./routes/apiVehicles');
var apiVehicleLogs = require('./routes/apiVehicleLogs');
var feeds = require('./routes/feeds');
var vehicle_logs = require('./routes/vehicle_logs');
var mongoose = require('mongoose');
var app = express();


var connect = function() {
    var options = {server: {socketOptions: {keepAlive:1}}};
    mongoose.connect('mongodb://nodejitsu:86d515135d8fc82ab63862f544b59e65@troup.mongohq.com:10084/nodejitsudb3087115902',options);
};

connect();
mongoose.connection.on('error', console.log);
mongoose.connection.on('disconnected', connect);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')), {maxAge: 10});

//passport bind
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

/*
AWS S3 CONFIG
*/
AWS.config.update({accessKeyId: 'AKIAIMLEGGCG5WIBWTOQ', secretAccessKey: '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'});

var s3bucket = new AWS.S3();
AWS.config.update({region: 'ap-southeast-1'});
app.use(multer({ // https://github.com/expressjs/multer
  dest: './public/', 
  limits : { fileSize:100000 },
  rename: function (fieldname, filename) {
    console.log(filename);
    return filename.replace(/\W+/g, '-').toLowerCase();
  },
  onFileUploadStart: function () {
    console.log("upload");
  },
  onError: function(){
    console.log("error occurred");
  },
  onFileUploadData: function (file, data, req, res) {
    console.log("upload");

    // file : { fieldname, originalname, name, encoding, mimetype, path, extension, size, truncated, buffer }
    var params = {
      Bucket: 'gasgaspinas',
      Key: file.name,
      Body: data
    };

    s3bucket.putObject(params, function (perr, pres) {
      if (perr) {
        console.log("Error uploading data: ", perr);
      } else {
        res.send("Successfully uploaded data to myBucket/myKey");
      }
    });
  }
}));

app.use('/', routes);
app.use('/users', users);
app.use('/feeds', feeds);
app.use('/vlogs', vehicle_logs);
app.use('/api', apiUsers);
app.use('/api', apiUVehicles);
app.use('/api', apiVehicleLogs);

// passport config
var admin = require('./models/admin');
passport.use(new LocalStrategy(admin.authenticate()));
passport.serializeUser(admin.serializeUser());
passport.deserializeUser(admin.deserializeUser());

var port = process.env.PORT || 3000;

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
app.listen(port);
