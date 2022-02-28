const PushBullet = require('pushbullet');
const {
    pushbullet: { apiToken, enable, deviceId, noteTitle }
} = require('../config');

const sendPushbullet = async ({ content, logger }) => {
    if (enable) {
        try {
            const pusher = new PushBullet(apiToken);
            const response = await pusher.note(deviceId, noteTitle, content);
            logger.info(`Pushbullet sent!`);
            logger.debug(`Pushbullet: ${response}`);
        } catch (err) {
            logger.error(`Could not send pushbullet`, err);
        }
    }
};

module.exports = {
    sendPushbullet
};
