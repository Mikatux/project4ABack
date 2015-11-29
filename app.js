'use strict';

//dependencies
var config = require('./config'),
        express = require('express'),
        bodyParser = require('body-parser'),
        http = require('http'),
        path = require('path'),
        mongoose = require('mongoose'),
        io = require('socket.io');


//create express app
var app = express();

//keep reference to config
app.config = config;

//setup the web server
app.server = http.createServer(app);

//setup mongoose
app.db = mongoose.createConnection(config.mongodb.uri);
app.db.on('error', console.error.bind(console, 'mongoose connection error: '));
app.db.once('open', function () {
    //and... we have a data store
});
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    if (req.headers.origin == "http://project.oversimplified.io") {
        res.setHeader('Access-Control-Allow-Origin', 'http://project.oversimplified.io');
    }
    else if (req.headers.origin == "http://beta.oversimplified.io") {
        res.setHeader('Access-Control-Allow-Origin', 'http://beta.oversimplified.io');
    }

    // Request methods you wish to allow
    // res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});

//config data models
require('./models')(app, mongoose);

//settings
app.set('port', config.port);


//setup routes
require('./routes')(app);

//listen up
app.server.listen(app.config.port, function () {
    //and... we're live
    console.log('Server is running on port ' + config.port);
});