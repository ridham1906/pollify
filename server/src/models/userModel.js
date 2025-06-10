const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    name : {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    googleId: {
        type: String,
        required: true,
        unique: true
    },
    polls: {
        type: [Schema.Types.ObjectId],
        ref: 'Poll'
    }
},{timestamps: true});

const User = mongoose.model('User', userSchema);

module.exports = User;