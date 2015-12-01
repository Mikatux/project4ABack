'use strict';

exports.getMessage = function (req, res) {
    req.app.db.models.Message.findOne({_id: req.params.id}, function (arr, data) {
        if (arr) {
            res.json({error: "bad Id"});
            //console.error(arr);
        }
        else if (data == "") {
            res.json({error: "bad Id"});
        }
        else
            res.send(data);
    });

};

exports.getMessages = function (req, res) {
     req.app.db.models.Message.find().populate("author").sort({date: 'desc'}).exec(function (arr, data) {

            res.send(data);
        });

};

exports.deleteMessage = function (req, res, next)
{
     req.app.db.models.Message.findOneAndRemove({_id: req.params.id}, function (arr, data) {
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
}
