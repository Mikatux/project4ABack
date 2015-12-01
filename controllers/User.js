'use strict';

exports.getUser = function (req, res) {
    req.app.db.models.User.findOne({_id: req.params.id}, function (arr, data) {
        if (arr) {
            res.json({error: "bad Id"});
            //console.error(arr);
        }
        else if (data == "" || data == null) {
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
        else if (data == "" || data == null) {
            res.json({
                error: true,
                data: "Bad Id "
            });
        }
        else {
            for (var x in data.groups) {
                var groupId = data.groups[x];
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

    var userModel = new req.app.db.models.User(req.body);
    userModel.date = new Date();
    userModel.save(function (err, user) {
        if (err) {
            res.status(500);
            res.json({
                error: true,
                data: "Error occured: " + err
            })
        }
        else if (user == "" || user == null) {
            res.status(500);
            res.json({
                error: true,
                data: "Error occured: " + err
            })
        }
        else {
            res.json({
                error: false,
                data: user
            });
        }
    });
}


exports.getMessages = function (req, res)
{
    req.app.db.models.User.findOne({_id: req.params.id}).populate("groups").exec(function (arr, data) {
        if (arr) {
            res.status(500);
            res.json({error: "bad Id1"});
        }
        else if (data == "" || data == null) {
            res.status(500);
            res.json({error: "bad Id2"});
        }
        else {
            var messagess = [];
            var groupss = 0;
            for (var x in data.groups) {
                var groupId = data.groups[x];
                req.app.db.models.Message.find({group: groupId}).exec(function (arr, messages) {
                    if (arr) {
                        console.log(arr);
                        /*
                         res.status(500);
                         res.json({
                         error: true,
                         data: "Error occured: " + arr
                         })
                         */
                    }
                    else if (messages == "" || messages == null) {
                        /*
                         res.status(500);
                         res.json({
                         error: true,
                         data: "Error occured "
                         })
                         */

                    }
                    else {
                        groupss++;
                        for (var y in messages) {

                            messagess.push(messages[y]);
                        }
                        if (groupss == data.groups.length - 1) {
                            res.json(messagess);
                        }

                    }
                });
            }
        }
    });


}