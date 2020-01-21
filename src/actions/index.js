const { sendEmail } = require('./send-email');
const { sendPushbullet } = require('./send-pushbullet');
const { sendSms } = require('./send-sms');

module.exports = {
    sendEmail,
    sendPushbullet,
    sendSms
};
