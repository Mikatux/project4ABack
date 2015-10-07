var restify = require('restify');
var fs = require('fs');
var simpleGitProd = require('simple-git')("/mnt/Disk2/websites/project_4a/");
var simpleGitBeta = require('simple-git')("/mnt/Disk2/websites/project_4a_beta/");
var mongoose = require('mongoose');

initBdd();
var Message;
var User;
function initBdd() {
    mongoose.connect('mongodb://localhost/project');
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function (callback) {
        console.log("Connected");
    });
    var Schema = mongoose.Schema;

    var UserSchema = new Schema({
        date: Date,
        name: String,
        lastname: String,
        img: String
    });


    mongoose.model('User', UserSchema);
    User = mongoose.model('User');

    var MessageSchema = new Schema({
        date: Date,
        type: String,
        content: String,
        author: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    });


    mongoose.model('Message', MessageSchema);
    Message = mongoose.model('Message');


}

function pullprod(req, res, next) {
    res.send(200, 'Pull request the : ' + Date().toString());
    simpleGitProd.pull();
    next();
}


function pullbeta(req, res, next) {
    res.send(200, 'Pull request the : ' + Date().toString());
    simpleGitBeta.pull();
    next();
}
function respond(req, res, next) {
    res.send(200, 'hello ' + req.params.name);
    next();
}


var server = restify.createServer();
server.use(restify.bodyParser());
server.use(function (req, res, next) {

    // Website you wish to allow to connect
    if(req.headers.origin == "http://project.oversimplified.io"){
    res.setHeader('Access-Control-Allow-Origin', 'http://project.oversimplified.io');
    }
    else if(req.headers.origin == "http://beta.oversimplified.io"){
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

server.get('/pushbeta/', pullbeta);
server.get('/pushprod/', pullprod);

server.get('/messages/', getMessages);
server.get('/message/:id', getMessage);
server.del('/message/:id', deleteMessage);
server.post('/message', newMessage);

server.get('/users/', getUsers);
server.get('/user/:id', getUser);
server.del('/user/:id', deleteUser);
server.post('/user', newUser);

server.head('/hello/:name', respond);
server.get('/hello/:name', respond);

server.listen(3000, function () {
    console.log('%s listening at %s', server.name, server.url);
});


function getUsers(req, res, next)
{
    User.find(function (arr, data) {
        res.send(data);
    });
}


function getUser(req, res, next)
{
    User.findOne({_id: req.params.id}, function (arr, data) {
        if (arr) {
            res.json({error: "bad Id"});
            //console.error(arr);
        }
        if (data == "") {
            res.json({error: "bad Id"});
        }
        else
            res.send(data);
    });
    next();
}

function deleteUser(req, res, next)
{
    User.findOneAndRemove({_id: req.params.id}, function (arr, data) {
        if (arr) {
            res.json({
                error: true,
                data: "Bad Id "
            });            //console.error(arr);
        }
        if (data == "") {
            res.json({
                error: true,
                data: "Bad Id "
            });
        }
        else
            res.json({
                error: false,
                data: "user removed"
            });
    });
    next();
}
function newUser(req, res, next)
{
    var userModel = new User(req.params);

    userModel.date = new Date();

    userModel.save(function (err, user) {
        if (err) {
            res.status(500);
            res.json({
                error: true,
                data: "Error occured: " + err
            })
        } else {
            res.json({
                error: false,
                data: user
            });
        }
    });

    next();
}

function getMessage(req, res, next)
{
    Message.findOne({_id: req.params.id}).populate('author').exec(function (arr, data) {
        if (arr) {
            res.json({
                error: true,
                data: "Bad Id "
            });            //console.error(arr);
        }
        if (data == "") {
            res.json({
                error: true,
                data: "Bad Id "
            });
        }
        else
            res.send(data);
    });
    next();
}

function deleteMessage(req, res, next)
{
    Message.findOneAndRemove({_id: req.params.id}, function (arr, data) {
        if (arr) {
            res.json({
                error: true,
                data: "Bad Id "
            });            //console.error(arr);
        }
        if (data == "") {
            res.json({
                error: true,
                data: "Bad Id "
            });
        }
        else
            res.json({
                error: false,
                data: "message removed"
            });
    });
    next();
}

function getMessages(req, res, next)
{
    Message.find().populate('author').exec(function (arr, data) {
        res.send(data);
    });
}

function newMessage(req, res, next)
{
    var messageModel = new Message(req.params);

    messageModel.date = new Date();
    var userId = req.params.userId;
    User.find({_id: userId}, function (arr, data) {
        if (arr) {
            res.status(400);
            res.json({
                error: true,
                data: "Bad Id "
            });
            //console.error(arr);
        }
        if (data == "") {
            res.status(400);
            res.json({
                error: true,
                data: "Bad Id "
            });
        }
        else
        {
            messageModel.author = userId;
            messageModel.save(function (err, message) {
                if (err) {
                    res.status(500);
                    res.json({
                        error: true,
                        data: "Error occured: " + err
                    })
                } else {
                    res.json({
                        error: false,
                        data: message
                    });
                }
            });
        }
        next();
    });
}