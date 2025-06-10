const mongoose = require('mongoose');
const { Schema } = mongoose;
const User = require('./userModel'); 

const optionSchema = new Schema({
    option: {
        type: String,
        required: true
    },
    votes: {
        type: Number,
        default: 0
    }
})

const pollSchema = new Schema({
    question: {
        type: String,
        required: true
    },
    options: [optionSchema],
    sessionCode : {
        type: String,
        unique: true,
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    expiresAt: {
        type: Date,
        default: ()=> Date.now() + 60 * 60 * 1000 // poll expires after 1 hour by default
    },

    status: {
        type: String,
        enum: ['active', 'expired'],
        default: 'active'
      }

});

pollSchema.post('findOneAndDelete', async function (doc) {
    if (doc && doc.createdBy) {
      await User.findByIdAndUpdate(doc.createdBy, {
        $pull: { polls: doc._id },
      });
    }
  });

const Poll = mongoose.model('Poll', pollSchema);

module.exports = Poll;