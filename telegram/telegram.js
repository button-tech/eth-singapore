const Telegraf = require('telegraf');
const session = require('telegraf/session');
const Handlers = require('./handlers/handlers');
const Stage = require("telegraf/stage");
const createAcc = require("./wizardScenes/createAcc")

const stage = new Stage();
require('dotenv').config({path: "../config/.env"});



const bot = new Telegraf(process.env.BOT_TOKEN);


stage.register(createAcc);

bot.use(session({ ttl: 10 }));
bot.use(stage.middleware());

bot.action("create", ctx=>{ctx.scene.enter("createAcc")})

bot.start((ctx) => Handlers.start(ctx));

bot.startPolling();
