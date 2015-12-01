'use strict';

var request = require('request');
var groupCreatedId = "";
var userCreatedId = "";


exports.delete = function (req, res) {

    // groupTester(res)

};

exports.create = function (req, res) {

    userTester(res)

};

function groupTester(res) {
    request({
        url: 'http://api.oversimplified.io/groups', //URL to hit
        // qs: {from: 'blog example', time: +new Date()}, //Query string data
        method: 'POST',
        //Lets post the following key/values as form
        json: {
            "name": "Tester Group",
            "public": "true",
            "author": userCreatedId,
            "img": "https://drscdn.500px.org/photo/90336243/m%3D2048/50c5bdb7574d1200909d1384e569d7c2"
        }
    }, function (error, response, body) {
        if (error) {
            res.json({
                error: true,
                data: "Group Error : " + error
            });
        } else {
            groupCreatedId = response._id;
            messageTester(res);
            //console.log(response.statusCode, body);
        }
    });
}

function userTester(res) {
    request({
        url: 'http://api.oversimplified.io/users', //URL to hit
        // qs: {from: 'blog example', time: +new Date()}, //Query string data
        method: 'POST',
        //Lets post the following key/values as form
        json: {
            "login": "Tester User",
            "name": "Tester",
            "lastname": "User",
            "email": "Tester@user.com",
            "password": "Tester User",
            "img": "https://drscdn.500px.org/photo/129167275/m%3D2048/02394e0729f4dee2d8f0535d7713f522"
        }
    }, function (error, response, body) {
        if (error) {
            res.json({
                error: true,
                data: "User Error : " + error
            });
        } else {
            userCreatedId = response._id;
            groupTester(res);
            //console.log(response.statusCode, body);
        }
    });
}

function messageTester(res) {
    request({
        url: 'http://api.oversimplified.io/groups/' + groupCreatedId + "/messages", //URL to hit
        // qs: {from: 'blog example', time: +new Date()}, //Query string data
        method: 'POST',
        //Lets post the following key/values as form
        json: {
            "userId": userCreatedId,
            "content":"Message du user"

        }
    }, function (error, response, body) {
        if (error) {
            res.json({
                error: true,
                data: "User Error : " + error
            });
        } else {
            res.json({
                error: false,
                data: "everithing OK userId : " + userCreatedId + " GroupId : " + groupCreatedId
            });
            //console.log(response.statusCode, body);
        }
    });
}
