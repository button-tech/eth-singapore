// const Markup = require('telegraf/markup');
// const Extra = require('telegraf/extra');
const text = require('./text.json');

const main = [
    [text.keyboard.main.button["0"]],
    [text.keyboard.main.button["1"]],
    [text.keyboard.main.button["2"]],
];

// const account = [
//     [Text.keyboard.account.button["0"]],
//     [Text.keyboard.account.button["1"]],
//     [Text.back]
// ];


module.exports = {
    main: main
    // account: account
}
