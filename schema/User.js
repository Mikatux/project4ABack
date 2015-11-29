'use strict';

exports = module.exports = function (app, mongoose) {
    var userSchema = new mongoose.Schema({
        date: Date,
        name: String,
        lastname: String,
        login: String,
        email: String,
        password: String,
        img: String,
        groups: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: "Group"
            }]
    });
    userSchema.methods.isInGroup = function (groupId) {

        return false;
    };

    userSchema.methods.addInGroup = function (group) {

        this.update({"$push": {"groups": group}}, function (arr, data) {
            if (arr) {
                return false;
            }
            else if (data === "") {
                return false;
            }
            else {
                return true;

            }
        });
        return false;
    };

    userSchema.statics.encryptPassword = function (password, done) {
        var bcrypt = require('bcrypt');
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return done(err);
            }

            bcrypt.hash(password, salt, function (err, hash) {
                done(err, hash);
            });
        });
    };
    userSchema.statics.validatePassword = function (password, hash, done) {
        var bcrypt = require('bcrypt');
        bcrypt.compare(password, hash, function (err, res) {
            done(err, res);
        });
    };
    userSchema.index({login: 1}, {unique: true});
    userSchema.index({email: 1}, {unique: true});
    // userSchema.set('autoIndex', (app.get('env') === 'development'));
    app.db.model('User', userSchema);
};