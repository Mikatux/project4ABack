'use strict';

exports.getUser = function (req, res) {

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

};


exports.getUsers = function (req, res) {

    User.find(function (arr, data) {

        res.send(data);
    });


};
