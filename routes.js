
exports = module.exports = function (app) {

    /*
     app.get('/pushbeta/', pullbeta);
     app.get('/pushprod/', pullprod);
     
     app.get('/messages/:id', getMessage);
     app.del('/messages/:id', deleteMessage);
     */


    var simpleGitProd = require('simple-git')("/mnt/Disk2/websites/project_4a/");
    var simpleGitBeta = require('simple-git')("/mnt/Disk2/websites/project_4a_beta/");

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
    app.get('/pushbeta/', pullbeta);
    app.get('/pushprod/', pullprod);


    function login(req, res)
    {
        //res.json({error: req.params.login});

        req.app.db.models.User.findOne({login: req.body.login}, function (arr, data) {
            if (arr) {
                //res.status(400);
                res.json({
                    error: true,
                    data: "Bad Login1"
                }); //console.error(arr);
            }
            if (data == "" || data == null) {

                res.json({
                    error: true,
                    data: "Bad Login2"
                });
            }
            else {
                res.send(data);
            }
        });
        //next();
    }

    app.post('/login', login);


    app.get('/users/', require('./controllers/User').getUsers);
    app.get('/users/:id', require('./controllers/User').getUser);
    app.get('/users/:id/coworkers', require('./controllers/User').getCoworkers);
    app.get('/users/:id/messages', require('./controllers/User').getMessages);
    app.delete('/users/:id', require('./controllers/User').deleteUser);
    app.post('/users', require('./controllers/User').newUser);


    app.get('/groups/', require('./controllers/Group').getGroups);
    app.get('/groups/:id', require('./controllers/Group').getGroup);
    app.delete('/groups/:id', require('./controllers/Group').deleteGroup);
    app.post('/groups/:id/messages', require('./controllers/Group').newMessage);
    app.get('/groups/:id/messages', require('./controllers/Group').getMessages);
    app.delete('/groups/:id/:idUser', require('./controllers/Group').deleteUserGroup);
    app.post('/groups/:id', require('./controllers/Group').modifyGroup);
    app.post('/groups', require('./controllers/Group').newGroup);

    /*
     app.post('/login', login);
     */
}