'use strict';

exports.getUser = function (req, res) {
    req.app.db.models.User.findOne({_id: req.params.id}, function (arr, data) {
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


exports.getUsers = function (req, res) {

    req.app.db.models.User.find(function (arr, data) {

        res.send(data);
    });


};



exports.getCoworkers = function (req, res) {

    req.app.db.models.User.find(function (arr, data) {

        res.send(data);
    });


};

exports.deleteUser = function (req, res) {

    req.app.db.models.User.findOneAndRemove({_id: req.params.id}, function (arr, data) {
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
                req.app.db.models.Group.update({_id: groupId}, {"$pull": {"members": data._id}}, function (arr, data) {
                });
            }
            res.json({
                error: false,
                data: "user removed"
            });
        }
    });
};



exports.newUser = function (req, res)
{
    var find = false;
    req.app.db.models.User.findOne({login: req.body.login}, function (arr, data) {
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
    req.app.db.models.User.findOne({email: req.body.email}, function (arr, data) {
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

    var userModel = new req.app.db.models.User(req.body);
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


exports.getMessages = function (req, res)
{
    req.app.db.models.User.findOne({_id: req.params.id}).populate("messages").exec( function (arr, data) {
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
    
}