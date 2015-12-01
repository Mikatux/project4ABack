'use strict';

exports = module.exports = function (app, mongoose) {
    var groupSchema = new mongoose.Schema({
        date: Date,
        name: String,
        public: Boolean,
        img: String,
        members: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }],
        pendingMember: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }],
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    });
    
    groupSchema.methods.isInGroup = function (userId) {

        if (this.members.indexOf(userId)>0)
            return true;
        return false;
    };

    groupSchema.methods.addUser = function (userId) {

        this.update({"$push": {"members": userId}}, function (arr, data) {
            if (arr) {
                return false;
            }
            else if (data === "" || data == null) {
                return false;
            }
            else {
                return true;
            }
        });
    };


    groupSchema.index({name: 1}, {unique: true});
    app.db.model('Group', groupSchema);
};