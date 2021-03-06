const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = new Schema({
    _id: { 
        type: Schema.ObjectId,
        auto: true 
    },
    userID: {
        type: Number,
    },
    nickname: {
        type: String,
        default: ''
    },
    ethereumAddress: {
        type: String,
        default: ''
    },
    tokenAddresses: {
      type: Array
    },
    registrationDate: {
        type: Date,
        default: Date.now()
    }
}, {
    versionKey: false
});

module.exports = mongoose.model('User', User);