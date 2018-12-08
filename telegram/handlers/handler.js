const Markup = require('telegraf/markup');
const Extra = require('telegraf/extra');
const rp = require('../request/request');
const Web3 = require('web3');
const guid = require('guid');
const redis = require("redis");
const WizardScene = require("telegraf/scenes/wizard");
const Keyboard = require('./../keyboard/keyboard');
const Text = require('./../text');
const db = require('./../db/db');
const utils = require('./../utils/utils');
const token = require('./../tokens/tokens');
require('dotenv').config({path: "./../../.env"});

const web3 = new Web3(new Web3.providers.HttpProvider(`https://rinkeby.infura.io/${process.env.INFURA_TOKEN}`));

const client = redis.createClient({
        host: process.env.REDIS_HOST || '127.0.0.1'
    });

const keyLifeTime = 600; // in seconds

async function start(ctx) {
    const user = await db.user.find.oneByID(ctx.message.from.id);

    if (user)
        return ctx.reply(Text.keyboard.start.text, Markup
            .keyboard(Keyboard.start)
            .resize()
            .extra()
        );
    else
        return createAccount(ctx);
}

function createAccount(ctx) {
    const key = guid.create().value;

    client.set(key, JSON.stringify({
        userID: ctx.message.from.id,
        nickname: ctx.message.from.username,
        lifetime: Date.now() + (keyLifeTime * 1000)
    }), 'EX', keyLifeTime);

    return ctx.reply(Text.inline_keyboard.create_wallet.text, Extra.markup(Keyboard.create_wallet(key)));
}

const bzx = new WizardScene(
    "bzx", ctx => {
    ctx.reply(Text.dialog.bzx["0"]);
    return ctx.wizard.next();
  },
  async ctx =>{
    switch(ctx.message.text){
        case "1":{
            ctx.session.orderType = Text.dialog.bzx["3"];
            ctx.reply(Text.dialog.bzx["1"]);
            return ctx.wizard.next();
        }
        case "2":{
            ctx.session.orderType = Text.dialog.bzx["4"];
            let trader = await db.user.trader.update(ctx.message.from.id, Text.borrowObject);
            return ctx.scene.leave();
        }
    }
},
ctx =>{
    ctx.session.amount = ctx.message.text
    ctx.reply("Amount: " + ctx.message.text);
    ctx.reply("Type: " + ctx.session.orderType);
    return ctx.scene.leave();
    }
);

const sendTransaction = new WizardScene(
    "sendTransaction", ctx => {
        ctx.session.currency = "Ethereum";
        ctx.reply(Text.dialog.sendTransaction["2"]);
        return ctx.wizard.next()
    },
    ctx => {
        ctx.session.to = ctx.message.text;
        ctx.reply(Text.dialog.sendTransaction["3"]);
        return ctx.wizard.next()
    },
    async ctx => {
        const tickerFrom = "ETH";
        const currency = ctx.session.currency;
        let amount;
        let amountInUsd;
        if (ctx.message.text.indexOf("$") >= 0) {
            amountInUsd = ctx.message.text.substring(0, ctx.message.text.length-1);
            amount = (Number(await utils.course.convert("USD", tickerFrom, amountInUsd)));
        } else {
            amount = ctx.message.text;
            amountInUsd = Number((await utils.course.convert(tickerFrom, "USD", amount)).toFixed(2));
        }
        console.log(amountInUsd)
        const key = guid.create().value;

        const userTo = ctx.session.to;

        let toUserID;
        let toAddress;
        let checker = false;
        let fromAddress;

        const user = await db.user.find.oneByID(ctx.message.from.id);
        fromAddress = user[`ethereumAddress`];

        if (currency == 'Ethereum' && web3.utils.isAddress(userTo)) {
            toAddress = userTo;
        } else {
            let to = ctx.session.to;
            if (to.match('@')) {
                to = to.substring(1);
            }
            const user = await db.user.find.oneByNickname(to);
            if (user) {
                toUserID = user.userID;
                toAddress = user.ethereumAddress;
                checker = true;
            } else {
                ctx.reply("User not defined");
                return ctx.scene.leave();
            }
        }

        client.set(key, JSON.stringify({
            currency: currency,
            fromUserID: ctx.message.from.id,
            toUserID: toUserID ? toUserID : 'null',
            fromAddress: fromAddress,
            toNickname: checker ? ctx.session.to : '',
            toAddress: toAddress,
            amount: amount,
            amountInUSD: ctx.session.isToken ? '0.000002' : amountInUsd,
            lifetime: Date.now() + (keyLifeTime * 1000),
            isToken: ctx.session.isToken
        }), 'EX', keyLifeTime);

        ctx.reply(Text.inline_keyboard.send_transaction.text, Extra.markup(Keyboard.create_transaction(key)));

        return ctx.scene.leave();
    }
);

function goToAccount(ctx) {
    return ctx.reply(Text.keyboard.account.text, Markup
        .keyboard(Keyboard.account)
        .resize()
        .extra()
    )
}

async function getAddresses(ctx) {
    const user = await db.user.find.oneByID(ctx.message.from.id);
    const text = `Ethereum address: \`\`\`${user.ethereumAddress}\`\`\``;
    return ctx.reply(text, { parse_mode: 'Markdown' });
}

function back(ctx) {
    start(ctx);
}

async function getBalances(ctx) {
    const user = await db.user.find.oneByID(ctx.message.from.id);
    const balanceETH = await web3.eth.getBalance(user.ethereumAddress);
    const balanceWETH = await rp.getTokenBalance('0xb603cea165119701b58d56d10d2060fbfb3efad8', user.ethereumAddress);
    console.log(balanceWETH)
    let msg = `*Ethereum:* ${balanceETH/1e18}\n\n*WETH:* ${Number(balanceWETH)/1e18}`;

    ctx.reply(msg, { parse_mode: 'Markdown' });
}

function createInstance(ABI, address) {
    return new web3.eth.Contract(ABI, address);
}

async function get(instance, methodName, addressFrom, parameters) {
    return await instance.methods[methodName](...parameters).call({from: addressFrom});
}

async function getBalance(tokenAddress, address) {
    const instance = createInstance(token.ABI, tokenAddress);
    return await get(instance, 'balanceOf', address, [address]);
}

module.exports = {
    start: start,
    sendTransaction: sendTransaction,
    getAddresses: getAddresses,
    goToAccount: goToAccount,
    getBalances: getBalances,
    back: back,
    bzx:bzx
};