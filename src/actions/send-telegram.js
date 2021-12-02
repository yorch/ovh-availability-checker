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
