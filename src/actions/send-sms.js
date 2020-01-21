const got = require('got');
const {
    sms: {
        enable,
        twilio: { accountSid, from, messagingServiceSid, secret, sid },
        toNumber
    }
} = require('../config');

const sendSms = ({ content, logger }) => {
    if (enable) {
        if (!content || content.length === 0) {
            logger.info('No content to send');
            return;
        }

        const recipients = toNumber.split(',');

        if (!toNumber || recipients.length === 0) {
            logger.info('No recipients to send');
            return;
        }

        const sendSmsToNumber = async (phoneNumber) => {
            logger.info(`Trying to send to number '${phoneNumber}'`);
            try {
                const { body: { status }, statusCode } = await got.post(
                    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
                    {
                        form: {
                            To: phoneNumber.trim(),
                            From: from,
                            MessagingServiceSid: messagingServiceSid,
                            Body: content
                        },
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        username: sid,
                        password: secret,
                        responseType: 'json'
                    }
                );
                logger.info(`Sent SMS to number ${phoneNumber} successful (status ${statusCode} - ${status})`);
            } catch (err) {
                logger.error(`Could not send SMS to number ${phoneNumber}`, err);
            }
        };

        return Promise.all(recipients.map(sendSmsToNumber));
    }
};

module.exports = {
    sendSms
};
