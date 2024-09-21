const { Schema, model } = require('mongoose');

const Profile = new Schema({
    UserId: {
        type: String,
        required: true
    },
    UserBio: {
        type: String,
        required: true
    },
})

module.exports = model("profile", Profile);
