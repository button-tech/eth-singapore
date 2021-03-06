const Telegraf = require('telegraf');
const session = require('telegraf/session');
const Handlers = require('./handlers/handler');
const Text = require('./text');
const Stage = require("telegraf/stage");

const stage = new Stage();

require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.use(session({ ttl: 10 }));
bot.use(stage.middleware());

bot.start((ctx) => Handlers.start(ctx));

bot.hears(Text.keyboard.start.button["0"], (ctx) => Handlers.goToAccount(ctx));
bot.hears(Text.keyboard.start.button["1"], (ctx) => ctx.scene.enter("sendTransaction"));
bot.hears(Text.keyboard.start.button["2"], (ctx) => Handlers.BZX(ctx));
bot.hears(Text.keyboard.account.button["0"], (ctx) => Handlers.getAddresses(ctx));
bot.hears(Text.keyboard.account.button["1"], (ctx) => Handlers.getBalances(ctx));

bot.action("loaner",async(ctx)=>{Handlers.Loaner(ctx)});
bot.action("borrower",(ctx)=>{ctx.scene.enter("borrower")});

bot.hears(Text.back, (ctx) => Handlers.back(ctx));

stage.register(Handlers.sendTransaction);
stage.register(Handlers.borrower)

bot.startPolling();

