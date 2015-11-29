'use strict';

exports.getGroup = function (req, res) {
    req.app.db.models.Group.findOne({_id: req.params.id}, function (arr, data) {
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

};


exports.getGroups = function (req, res) {

    req.app.db.models.Group.find(function (arr, data) {

        res.send(data);
    });


};


exports.deleteGroup = function (req, res) {

    req.app.db.models.Group.findOneAndRemove({_id: req.params.id}, function (arr, group) {
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
                req.app.db.models.User.update({_id: userId}, {"$pull": {"groups": group._id}}, function (arr, data) {
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
};

exports.newGroup = function (req, res)
{
    console.log(req.body);
    var groupModel = new Group(req.body);
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
            req.app.db.models.User.update({_id: group.author}, {"$push": {"groups": group._id}}, function (arr, data) {

                req.app.db.models.Group.update({_id: group._id}, {"$push": {"members": group.author}}, function (arr, data) {
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
};

exports.modifyGroup = function (req, res)
{
    req.app.db.models.Group.findOne({_id: req.params.id}, function (arr, data) {
        if (arr) {
            res.json({error: "bad Id"});
            //console.error(arr);
        }
        if (data === "") {
            res.json({error: "bad Id"});
        }
        else {
            if (!data.isInGroup(req.body.userId)) {
                data.addUser(req.body.userId);
                req.app.db.models.User.findOne({_id: req.body.userId}, function (arr, user) {
                    if (arr) {
                        res.json({error: "bad Id"});
                        //console.error(arr);
                    }
                    if (user === "") {
                        res.json({error: "bad Id"});
                    }
                    else {
                        if (user.addInGroup(req.params.id)) {
                            res.json(data);
                        }
                    }
                });

            }
            else
                res.json(data);

            // data.members+=req.params.usersId;
            // res.send(data);
        }
    });
}

exports.deleteUserGroup = function (req, res)
{
    req.app.db.models.Group.findOne({_id: req.params.id}, function (arr, data) {
        if (arr) {
            res.json({error: "bad Id"});
            //console.error(arr);
        }
        if (data === "") {
            res.json({error: "bad Id"});
        }
        else {
            req.app.db.models.Group.update({_id: req.params.id}, {"$pull": {"members": req.params.idUser}}, function (arr, data) {
                if (arr) {
                    res.json({error: "bad Id"});
                    //console.error(arr);
                }
                else if (data === "") {
                    res.json({error: "bad Id"});
                }
                else {
                    req.app.db.models.User.update({_id: req.params.idUser}, {"$pull": {"groups": req.params.id}}, function (arr, data) {
                        res.json(data);
                    });
                }
            })
            // data.members+=req.params.usersId;
            // res.send(data);
        }
    });
}

exports.newMessage = function (req, res)
{
    var messageModel = new req.app.db.models.Message(req.body);
    // console.log("Cookies: ", req.cookies)
    messageModel.date = new Date();
    messageModel.group = req.params.id;

    req.app.db.models.User.findOne({_id: req.body.userId}, function (arr, data) {
        if (arr) {
            res.status(400);
            res.json({
                error: true,
                data: "Bad Id1 "
            });
            //console.error(arr);
        }
        if (data == "") {
            res.status(400);
            res.json({
                error: true,
                data: "Bad Id2 "
            });
        }
        else
        {
            messageModel.author = data;
            messageModel.save(function (err, message) {
                if (err) {
                    res.status(500);
                    res.json({
                        error: true,
                        data: "Error occured: " + err
                    })
                } else {
                    //req.app.listener.sockets.emit('message', message.toString());
                    res.json({
                        error: false,
                        data: message
                    });
                }
            });
        }
    });
}

exports.getMessages = function (req, res)
{
    var messagePerPage = 25;
    if (req.params.page != '') {
        req.app.db.models.Message.find({group: req.params.id}).sort({date: 'desc'}).limit(messagePerPage).skip(messagePerPage * (req.body.page - 1)).exec(function (arr, data) {
            //data = {coucou:"tata"};

            res.send(data);
        });
    }
    else {
        req.app.db.models.Message.find({group: req.params.id}).sort({date: 'desc'}).populate('author').exec(function (arr, data) {
            //data = {coucou:"toto"};
            res.send(data);
        });
    }

}