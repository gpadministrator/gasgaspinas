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

var PROTOCOL = 'https://';
var AWSURL = 'amazonaws.com';
var REGION = 'ap-southeast-1';
var PRODUCT = { s3: 's3'};
var BUCKET = 'gasgaspinas';
var S3URL = PROTOCOL+PRODUCT.s3+'-'+REGION+'.'+AWSURL+'/';

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
AWS.config.update({region: REGION});
app.use(multer({ // https://github.com/expressjs/multer
  dest: './public/', 
  limits : { fileSize:100000 },
  inMemory: true,
  onFileUploadStart: function () {
    console.log("upload");
  },
  onError: function(){
    console.log("error occurred");
  },
  onFileUploadData: function (file, data, req, res) {
    console.log("upload");
    console.log(JSON.stringify(file));
    // file : { fieldname, originalname, name, encoding, mimetype, path, extension, size, truncated, buffer }
    var params = {
      Bucket: BUCKET,
      ACL: 'public-read',
      Key: file.name,
      ContentType: file.mimetype,
      Body: data
    };

    s3bucket.upload(params, function (perr, pres) {
      if (perr) {
        res.send({msg: false, data: perr});
      } else {
        console.log(JSON.stringify(pres));
        res.send ({
          msg: true, 
          data: pres
        });
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
        /*res.render('error', {*/
        res.send({
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
