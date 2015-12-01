var restify = require('restify');
var fs = require('fs');
var simpleGitProd = require('simple-git')("/mnt/Disk2/websites/project_4a/");
var simpleGitBeta = require('simple-git')("/mnt/Disk2/websites/project_4a_beta/");
var mongoose = require('mongoose');
var io = require('socket.io');
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
        login: String,
        email: String,
        password: String,
        img: String,
        groups: [{
                type: Schema.Types.ObjectId,
                ref: "Group"
            }],
    });
    mongoose.model('User', UserSchema);
    User = mongoose.model('User');
    var MessageSchema = new Schema({
        date: Date,
        type: String,
        content: String,
        moodGood: [{
                type: Schema.Types.ObjectId,
                ref: "User"
            }],
        moodBad: [{
                type: Schema.Types.ObjectId,
                ref: "User"
            }],
        reported: Number,
        image: [],
        favorite: [{
                type: Schema.Types.ObjectId,
                ref: "User"
            }],
        group: {
            type: Schema.Types.ObjectId,
            ref: "Group"
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        answer: [{
                type: Schema.Types.ObjectId,
                ref: "Message"
            }]
    });
    mongoose.model('Message', MessageSchema);
    Message = mongoose.model('Message');
    var GroupSchema = new Schema({
        date: Date,
        name: String,
        public: Boolean,
        img: String,
        members: [{
                type: Schema.Types.ObjectId,
                ref: "User"
            }],
        pendingMember: [{
                type: Schema.Types.ObjectId,
                ref: "User"
            }],
        author: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    });
    mongoose.model('Group', GroupSchema);
    Group = mongoose.model('Group');
}

function pullprod(req, res, next) {

    simpleGitProd.pull(function (err, update) {
        if (update) {
            pullbeta(req, res, next);
            //  res.send(200, 'Pull request the : ' + Date().toString());
            // next();
        }
    });
}


function pullbeta(req, res, next) {

    simpleGitBeta.pull(function (err, update) {
        if (update) {
            res.send(200, 'Pull request the : ' + Date().toString());
            next();
        }
    });
}
function respond(req, res, next) {
    res.send(200, 'hello ' + req.params.name);
    next();
}


var server = restify.createServer();
server.use(restify.bodyParser());
server.use(function (req, res, next) {

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
var listener = io.listen(server.server);
//listener.set('origins', 'http://project.oversimplified.io');
listener.on('connection', function (socket) {
    console.log('a user connected');
    socket.broadcast.emit('message', "connected");
});
server.get('/pushbeta/', pullbeta);
server.get('/pushprod/', pullprod);

server.get('/messages/:id', getMessage);
server.del('/messages/:id', deleteMessage);

server.get('/users/', getUsers);
server.get('/users/:id', getUser);
server.get('/users/:id/coworkers', getCoworkers);
server.get('/users/:id/messages', getMessages);
server.del('/users/:id', deleteUser);
server.post('/users', newUser);

server.get('/groups/', getGroups);
server.get('/groups/:id', getGroup);
server.del('/groups/:id', deleteGroup);
server.post('/groups/:idGroup/messages', newMessage);
server.get('/groups/:id/messages/', getMessages);
server.del('/groups/:id/:iduser', deleteUserGroup);
server.post('/groups/:id', modifyGroup);
server.post('/groups', newGroup);

server.post('/login', login);
server.listen(1024, function () {
    console.log('%s listening at %s', server.name, server.url);
});
function getUsers(req, res, next)
{
    User.find(function (arr, data) {
        /*
         for (x in data) {
         userId = data[x]._id;
         User.update({_id: userId}, {"$pull": {"groups": null}}, function (arr, data) {
         });
         
         }
         */
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

function getCoworkers(req, res, next)
{
    User.find(function (arr, data) {
        /*
         for (x in data) {
         userId = data[x]._id;
         User.update({_id: userId}, {"$pull": {"groups": null}}, function (arr, data) {
         });
         
         }
         */
        res.send(data);
    });
    /*
     User.findOne({_id: req.params.id}).populate('groups').exec(function (arr, data) {
     if (arr) {
     res.json({error: "bad Id"});
     //console.error(arr);
     }
     if (data == "") {
     res.json({error: "bad Id"});
     }
     else {
     var coworkers = {users: []};
     for (x in data.groups) {
     dataGroup = data.groups[x];
     //test = groupId.toString();
     //res.json(dataGroup.members);
     
     for (y in dataGroup.members) {
     
     coworkerId = dataGroup.members[y];
     if (coworkerId == "" || coworkerId == null)
     res.json(coworkers);
     coworkers.users.push({
     "_id": coworkerId
     
     });
     
     }
     
     
     }
     res.json(coworkers);
     
     
     }
     });
     
     next();
     */
}
function deleteUser(req, res, next)
{
    User.findOneAndRemove({_id: req.params.id}, function (arr, data) {
        if (arr) {
            res.json({
                error: true,
                data: "Bad Id "
            }); //console.error(arr);
        }
        if (data == "") {
            res.json({
                error: true,
                data: "Bad Id "
            });
        }
        else {
            for (x in data.groups) {
                groupId = data.groups[x];
                Group.update({_id: groupId}, {"$pull": {"members": data._id}}, function (arr, data) {
                });
            }
            res.json({
                error: false,
                data: "user removed"
            });
        }
    });
    next();
}


function newUser(req, res, next)
{
    var find = false;
    User.findOne({login: req.params.login}, function (arr, data) {
        if (arr) {
            //res.status(400);

            //console.error(arr);
        }
        if (data == "" || data == null) {
            //res.status(400);


        }
        else {
            find = true;
        }
    });
    User.findOne({email: req.params.email}, function (arr, data) {
        if (arr) {
            //res.status(400);

            //console.error(arr);
        }
        if (data == "" || data == null) {
            //res.status(400);


        }
        else {
            find = true;
        }
    });
    if (find == true) {
        res.json({
            error: true,
            data: "Already exist"
        });
        next();
    }

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



function getGroups(req, res, next)
{
    Group.find(function (arr, data) {
        res.send(data);
    });
}


function deleteUserGroup(req, res, next)
{
    Group.findOne({_id: req.params.id}, function (arr, data) {
        if (arr) {
            res.json({error: "bad Id"});
            //console.error(arr);
        }
        if (data === "") {
            res.json({error: "bad Id"});
        }
        else {
            Group.update({_id: req.params.id}, {"$pull": {"members": req.params.iduser}}, function (arr, data) {
                if (arr) {
                    res.json({error: "bad Id"});
                    //console.error(arr);
                }
                else if (data === "") {
                    res.json({error: "bad Id"});
                }
                else {
                    User.update({_id: req.params.iduser}, {"$pull": {"groups": req.params.id}}, function (arr, data) {
                        res.json(data);
                        next();
                    });
                }
            })
            // data.members+=req.params.usersId;
            // res.send(data);
        }
    });
    // next();
}

function modifyGroup(req, res, next)
{
    Group.findOne({_id: req.params.id}, function (arr, data) {
        if (arr) {
            res.json({error: "bad Id"});
            //console.error(arr);
        }
        if (data === "") {
            res.json({error: "bad Id"});
        }
        else {
            Group.update({_id: req.params.id}, {"$push": {"members": req.params.userId}}, function (arr, data) {
                if (arr) {
                    res.json({error: "bad Id"});
                    //console.error(arr);
                }
                else if (data === "") {
                    res.json({error: "bad Id"});
                }
                else {
                    User.update({_id: req.params.userId}, {"$push": {"groups": req.params.id}}, function (arr, data) {

                    });
                    res.json(data);
                }
                next();
            })
            // data.members+=req.params.usersId;
            // res.send(data);
        }
    });
    // next();
}


function getGroup(req, res, next)
{
    Group.findOne({_id: req.params.id}, function (arr, data) {
        if (arr) {
            res.json({error: "bad Id"});
            //console.error(arr);
        }
        if (data === "") {
            res.json({error: "bad Id"});
        }
        else
            res.send(data);
    });
    next();
}

function deleteGroup(req, res, next)
{
    Group.findOneAndRemove({_id: req.params.id}, function (arr, group) {
        if (arr) {
            res.json({
                error: true,
                data: "Bad Id "
            }); //console.error(arr);
        }
        if (data == "") {
            res.json({
                error: true,
                data: "Bad Id "
            });
        }
        else {
            for (x in group.members) {
                userId = group.members[x];
                User.update({_id: userId}, {"$pull": {"groups": group._id}}, function (arr, data) {
                });
            }
            res.json({
                groupId: group._id,
                userId: group.author,
                error: false,
                data: "group removed"
            });
        }
    });
    next();
}


function newGroup(req, res, next)
{
    console.log(req.params);
    var groupModel = new Group(req.params);
    groupModel.date = new Date();
    groupModel.save(function (err, group) {
        if (err) {
            res.status(500);
            console.log(err);
            res.json({
                error: true,
                data: "Error occured: " + err
            })
        } else {
            User.update({_id: group.author}, {"$push": {"groups": group._id}}, function (arr, data) {

                Group.update({_id: group._id}, {"$push": {"members": group.author}}, function (arr, data) {
                    res.json({
                        groupId: group._id,
                        userId: group.author,
                        error: false,
                        data: group
                    });
                    next();
                });
            });
        }
    });
}




function getMessage(req, res, next)
{
    Message.findOne({_id: req.params.id}).populate('author').exec(function (arr, data) {
        if (arr) {
            res.json({
                error: true,
                data: "Bad Id "
            }); //console.error(arr);
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
            }); //console.error(arr);
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
    var messagePerPage = 25;
    if (req.params.page != '') {
        Message.find({group: req.params.id}).sort({date: 'desc'}).limit(messagePerPage).skip(messagePerPage * (req.params.page - 1)).exec(function (arr, data) {
            //data = {coucou:"tata"};

            res.send(data);
        });
    }
    else {
        Message.find({group: req.params.id}).sort({date: 'desc'}).populate('author').exec(function (arr, data) {
            //data = {coucou:"toto"};
            res.send(data);
        });
    }

}

function newMessage(req, res, next)
{
    var messageModel = new Message(req.params);
    console.log("Cookies: ", req.cookies)
    messageModel.date = new Date();
    messageModel.group = req.params.idGroup;
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
                    listener.sockets.emit('message', message.toString());
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



function login(req, res, next)
{
    //res.json({error: req.params.login});

    User.findOne({login: req.params.login}, function (arr, data) {
        if (arr) {
            //res.status(400);

            res.json({
                error: true,
                data: "Bad Login"
            }); //console.error(arr);
        }
        if (data == "" || data == null) {
            //res.status(400);
            res.json({
                error: true,
                data: "Bad Login"
            });
        }
        else {
            res.send(data);
        }
    });
    next();
}