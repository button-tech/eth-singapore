const mongoose = require("mongoose");
require('dotenv').config({path: "./../.env"});
const userName = process.env.LOGIN;
const password = process.env.PASSWORD;
const config = require("../config/config")

const uri = `${config.connectToMongo.docker}+${config.dbName.beth}`;

const options = {
    autoIndex: false,
    reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 500, // Reconnect every 500ms
    poolSize: 1000, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    bufferMaxEntries: 0,
    useNewUrlParser: true
};

const db = mongoose.connect(uri, options).then(console.log('Mongo DB works fine'));

module.exports = {
    db:db
}
