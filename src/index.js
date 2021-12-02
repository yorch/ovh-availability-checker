require('dotenv').config();

const { logger } = require('./utils/logger');
const { AvailabilityChecker } = require('./availability-checker');
const { sendEmail, sendPushbullet, sendSms, sendTelegram } = require('./actions');
const { availabilityUrl, cronSchedule } = require('./config');
const serversToCheck = require('../servers.json');

if (!availabilityUrl) {
    logger.info('No availabilityUrl configured, exiting');
    return;
}

const availabilityChecker = new AvailabilityChecker({
    actions: [sendEmail, sendPushbullet, sendSms, sendTelegram],
    logger,
    serversToCheck,
    url: availabilityUrl
});

if (cronSchedule) {
    availabilityChecker.setupSchedule(cronSchedule);
} else {
    // Run once
    availabilityChecker.run();
}

process.on('SIGTERM', () => {
    logger.info('Got a SIGTERM, exiting');
    process.exit(1);
});
