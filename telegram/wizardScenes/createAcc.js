const WizardScene = require("telegraf/scenes/wizard");
const text = require("../keyboard/text");
const db = require("../../db/db");
const Markup = require('telegraf/markup');
const kb = require("../keyboard/keyboard")

const createAcc = new WizardScene(
    "createAcc", ctx=>{
        ctx.reply(text.dialog.create["0"], {parse_mode: 'Markdown'});
        return ctx.wizard.next()
    },
    async ctx=> {
        await db.user.create(ctx.message.from.id, ctx.message.from.username, ctx.message.text);
        ctx.reply(text.dialog.create["1"], Markup
                .keyboard(kb.main)
                .resize()
                .extra())
        return ctx.scene.leave()

    }
);

module.exports = {
    createAcc:createAcc
};
