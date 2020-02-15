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

        const client = new twilio(sid, secret, { accountSid });

        const sendSmsToNumber = (phoneNumber) => {
            logger.info(`Trying to send to number '${phoneNumber}'`);
            return client.messages
                .create({
                    body,
                    to: phoneNumber.trim(),
                    from
                })
                .then((message) => {
                    const { errorCode, errorMessage, status, statusCode } = message;
                    if (errorCode) {
                        logger.error(
                            `There was an error sending SMS to number ${phoneNumber} (${errorCode} - ${errorMessage})`
                        )

                    } else {
                        logger.info(
                            `Sent SMS to number '${phoneNumber}' successful (status ${statusCode} - ${status})`
                        );
                    }
                    return message;
                })
                .catch((error) => {
                    logger.error(
                        `Could not send SMS to number '${phoneNumber}'`,
                        error
                    );
                });
        };

        return Promise.all(recipients.map(sendSmsToNumber));
    }
};

module.exports = {
    sendSms
};
