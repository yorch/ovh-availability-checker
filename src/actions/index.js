const { sendEmail } = require('./send-email');
const { sendPushbullet } = require('./send-pushbullet');
const { sendTelegram } = require('./send-telegram');
const { sendSms } = require('./send-sms');

module.exports = {
    sendEmail,
    sendPushbullet,
    sendTelegram,
    sendSms
};
