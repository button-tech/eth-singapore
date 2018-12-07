const Telegraf = require('telegraf');
const session = require('telegraf/session');
const handlers = require('./handlers/handlers');
const Stage = require("telegraf/stage");
const create = require("./wizardScenes/createAcc")
const stage = new Stage();
const text = require("./keyboard/text")

require('dotenv').config({path: "../config/.env"});

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.use(session({ ttl: 10 }));
bot.use(stage.middleware());

bot.start((ctx) => handlers.start(ctx));

bot.hears(text.keyboard.main.button.b, (ctx)=>{handlers.balances(ctx)})

stage.register(create.createAcc);
bot.startPolling();
