const db = require("../../db/db")
const text = require("../keyboard/text")
const Markup = require('telegraf/markup');
const kb = require("../keyboard/keyboard")

const WizardScene = require("telegraf/scenes/wizard");

async function start(ctx) {
    const user = await db.user.find.oneByID(ctx.message.from.id);
    if (user)
        return ctx.reply(text.keyboard.text, Markup
            .keyboard(kb.main)
            .resize()
            .extra()
        )
}

module.exports = {
    start: start
}
