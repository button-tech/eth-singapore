const WizardScene = require("telegraf/scenes/wizard")

const createAcc = new WizardScene(
    "create", ctx=>{
        ctx.reply(text.dialog.create["0"], {parse_mode: 'Markdown'});
        return ctx.wizard.next()
    },
    async ctx=> {
        await db.user.create(ctx.message.from.id, ctx.message.from.username, ctx.message.text);
            return ctx.reply(text.dialog.create["1"], Markup
                .keyboard(kb.keyboard.main)
                .resize()
                .extra())
    }
)

module.exports = {
    createAcc:createAcc
}
