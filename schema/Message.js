'use strict';

exports = module.exports = function (app, mongoose) {
    var messageSchema = new mongoose.Schema({
        date: Date,
        type: String,
        content: String,
        moodGood: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }],
        moodBad: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }],
        reported: Number,
        image: [],
        favorite: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }],
        group: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Group"
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        answer: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: "Message"
            }],
        readed: {type: Boolean, default: false}
    });

    messageSchema.methods.addAnswer = function (message) {

        return false;
    };

    app.db.model('Message', messageSchema);
};