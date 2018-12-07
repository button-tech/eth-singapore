const db = require("../../db/db")
const text = require("../keyboard/text")
const markup = require('telegraf/markup');
const kb = require("../keyboard/keyboard")

async function start(ctx) {

    const user = await db.user.find.oneByID(ctx.message.from.id);

    if (user)
        return ctx.reply(text.keyboard.main.text, markup
            .keyboard(kb.main)
            .resize()
            .extra())
    else
        ctx.scene.enter("createAcc")
}

async function balances(ctx){
    const user = await db.user.find.oneByID(ctx.message.from.id);
    console.log(user.ethereumAddress)
}

module.exports = {
    start: start,
    balances:balances
};
