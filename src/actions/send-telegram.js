// https://github.com/yagop/node-telegram-bot-api/blob/master/src/telegram.js#L64-L84
process.env.NTBA_FIX_319 = 'false';

const TelegramBot = require('node-telegram-bot-api');

const {
    telegram: { botToken, enable, chatId }
} = require('../config');

const sendTelegram = ({ content, logger }) => {
    if (enable) {
        const bot = new TelegramBot(botToken);
        bot.sendMessage(chatId, content);
    }
};

module.exports = {
    sendTelegram
};
