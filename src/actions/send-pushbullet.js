const PushBullet = require('pushbullet');
const { pushbullet: { apiToken, enable, deviceId, noteTitle } } = require('../config');

const sendPushbullet = ({ content, logger }) => {
    if (enable) {
        const pusher = new PushBullet(apiToken);
        pusher.note(
            deviceId,
            noteTitle,
            content,
            (error, response) => {
                if (error) {
                    logger.error(`Could not send pushbullet`, err);
                    return;
                }
                logger.info(`Pushbullet sent!`);
                logger.debug(`Pushbullet: ${response}`)
            }
        )
    }
};

module.exports = {
    sendPushbullet
};
