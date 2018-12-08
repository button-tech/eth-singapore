const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = new Schema({
    _id: { 
        type: Schema.ObjectId,
        auto: true 
    },
    orders: {
        type: JSON,
    },
}, {
    versionKey: false
});

module.exports = mongoose.model('User', User);