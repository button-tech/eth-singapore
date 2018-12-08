const db = require('./../db/db');
const telegram = require('./../messangers/telegram');
require('dotenv').config({path: "./../.env"});
const redis = require("redis"),
    client = redis.createClient({
        host: process.env.REDIS_HOST || '127.0.0.1'
    });
const {promisify} = require('util');
const getAsync = promisify(client.get).bind(client);
const Keyboard = require('./../keyboard/keyboard');

async function updateOrder(req, res) {
    const id = req.params.guid;

    getAsync(id)
        .then(async value => {
            value = JSON.parse(value);
            console.log(value)
            await db.bzx.create(value);
            
            client.del(id);

            res.send({
                error: null,
                result: 'success'
            });
        })
        .catch(e => {
            res.send({
                error: e.message,
                result: null
            });
        })
}

async function getOrder(req,res) {
    const id = req.params.guid;
    getAsync(id)
        .then(value => {
            if (value != null)
                res.send({
                    error: null,
                    result: JSON.parse(value)
                });
            else
                res.send({
                    error: 'Deleted',
                    result: null
                });
        })
        .catch(e => {
            console.log(e)
            res.send({
                error: e.message,
                result: null
            });
        });
}

module.exports = {
    getOrder: getOrder,
    updateOrder: updateOrder,
};